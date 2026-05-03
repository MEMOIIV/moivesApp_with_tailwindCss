/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ApiContext, APIUser, ShardLinks } from "../../context/context";
import { HeartBreakIcon, HeartIcon } from "../../utils/icons";
import axios from "axios";
import { layerLoading, listIsEmpty } from "../../utils/card";
import { Link, useNavigate } from "react-router-dom";

export default function Favorites() {
  const { user, getUserData } = useContext(APIUser);
  const { apiKey, isGuest, userLogout } = useContext(ApiContext);
  const { linksMedia } = useContext(ShardLinks);

  const [allMedia, setAllMedia] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All");

  let navigate = useNavigate();
  function logout() {
    userLogout();
    navigate("/login");
  }

  const options = [
    { id: "all", name: "All" },
    { id: "movie", name: "Movies" },
    { id: "tv", name: "TV Shows" },
  ];

  async function getAllMedia() {
    const favorites = user?.data?.profile?.favorites || [];

    if (favorites.length === 0) {
      setAllMedia([]);
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      const requests = favorites.map((fav) =>
        axios.get(
          `https://api.themoviedb.org/3/${fav.mediaType}/${fav.mediaId}?api_key=${apiKey}`,
        ),
      );

      const responses = await Promise.all(requests);
      // هنا السر: نقوم بدمج الـ mediaType مع البيانات القادمة
      const data = responses.map((res, index) => ({
        ...res.data,
        type: favorites[index].mediaType, // نحفظ هل هو movie أم tv
      }));

      setAllMedia(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsFetching(false); // نضمن توقف التحميل هنا
    }
  }

  const filteredMedia = useMemo(() => {
    if (selected === "All") {
      return allMedia; // إذا اختار الكل، ارجع المصفوفة كاملة
    }

    // إذا اختار Movies، فلتر المصفوفة لتشمل العناصر التي نوعها movie فقط
    // ملاحظة: تأكد أن قيمة الـ id في الـ options مطابقة لما نفلتر به
    const typeToFilter = selected === "Movies" ? "movie" : "tv";

    return allMedia.filter((item) => item.type === typeToFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMedia, selected]);

  useEffect(() => {
    // التحقق من أن الـ user تم تحميله من الـ Context
    if (user && user.data) {
      getAllMedia();
    }
  }, [user, user?.data?.profile?.favorites]);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target.id != "dropMenu") {
        setIsOpen(false);
      }
    });
  });

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className=" mt-defaultPadding w-[90%] m-auto pb-10">
      {/* Dropdown Wrapper */}
      {!isGuest && (
        <div className="relative inline-block mb-8">
          {/* Main Filter Button */}
          <button
            id="dropMenu"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex justify-between items-center w-48 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg border border-gray-700 hover:border-red-600 transition-all duration-300 focus:outline-none shadow-md"
          >
            <span>{selected}</span>
            <svg
              className={`w-4 h-4 ml-2 text-red-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col py-1">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelected(option.name);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2.5 text-sm text-left transition-colors duration-200
                    ${
                      selected === option.name
                        ? "bg-red-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Media data */}
      <section className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isGuest ? (
          <div className="col-span-full flex justify-center items-center py-40">
            {listIsEmpty(true, logout)}
          </div>
        ) : isFetching ? (
          layerLoading(10)
        ) : filteredMedia.length > 0 ? (
          filteredMedia.map((item, index) => (
            <div key={item.id || index} className="relative">
              {linksMedia(item)}
            </div>
          ))
        ) : (
          <div className="col-span-full">{listIsEmpty(false, logout)}</div>
        )}
      </section>
    </div>
  );
}
