/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext, useEffect, useState } from "react";
import { layerLoading } from "../../utils/card";
import axios from "axios";
import { ApiContext } from "../../context/context";
import { Link } from "react-router-dom";

export default function Search() {
  const { apiKey, valueSearchIn } = useContext(ApiContext);
  const [multiData, setMultiData] = useState([]);
  const [notFound, setNotFound] = useState(false);

  async function searchMulti() {
    const badWords = ["sex", "fuck", "porn", "kiss"];

    const query = valueSearchIn?.toLowerCase().trim();

    if (!query) return;

    if (badWords.includes(query)) {
      setMultiData([]); // نظف النتائج
      setNotFound(true); // اعرض رسالة
      return; // مهم جدًا يمنع API
    }

    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${valueSearchIn}`,
      );
      let moviesAndTv = data.results.filter(
        (item) => item.media_type !== "person",
      );
      setMultiData(moviesAndTv);
      setNotFound(true);
    } catch (error) {
      console.log(error);
      setNotFound(false);
    }
  }

  useEffect(() => {
    if (valueSearchIn != null) {
      setTimeout(() => {
        searchMulti();
      }, 500);
    }
  }, [valueSearchIn]);
  return (
    <section className="w-[90%] m-auto mt-defaultPadding pb-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 py-6">
      {multiData.length != 0 ? (
        multiData.map((data, index) => (
          <div key={index} className="relative">
            <Link to={`/details/${data.media_type}/${data.id}`}>
              <img
                src={
                  data.poster_path != null
                    ? "https://image.tmdb.org/t/p/w500" + data.poster_path
                    : "/No-Image.png"
                }
                className="w-full h-87.5"
                onError={(e) => (e.target.src = "/No-Image.png")}
                alt="image"
              />
            </Link>
            <h6 className="pt-1">{data.title || data.name}</h6>
            <p
              className={`absolute top-0 right-0 p-2 bg-bgTransparent ${
                Number.isInteger(Math.round(data.vote_average * 10) / 10)
                  ? "px-3.5"
                  : ""
              }`}
            >
              {Math.round(data.vote_average * 10) / 10}
            </p>
          </div>
        ))
      ) : notFound == false ? (
        layerLoading(20)
      ) : (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-4xl">
          <h1>There are no results for your search</h1>
        </div>
      )}
    </section>
  );
}
