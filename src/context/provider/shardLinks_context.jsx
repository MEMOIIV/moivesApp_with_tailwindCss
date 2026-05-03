import React, { useContext } from "react";
import { ApiContext, APIUser, ShardLinks } from "../context";
import { Link } from "react-router-dom";
import { HeartIcon } from "../../utils/icons";
import Swal from "sweetalert2";
export default function ShardLinks_context(props) {
  const { isGuest, userLogout } = useContext(ApiContext);
  const { user, deletedFromFavorite, addToFavorites } = useContext(APIUser);
  function linksMedia(media) {
    return (
      <>
        <div>
          <Link to={`/details/${media.media_type}/${media.id}`}>
            <img
              src={
                media.poster_path != null
                  ? "https://image.tmdb.org/t/p/w500" + media.poster_path
                  : "/No-Image.png"
              }
              className="w-full h-80.5 sm:h-70  md:h-77 lg:h-80.5 "
              onError={(e) => (e.target.src = "/No-Image.png")}
              alt="image"
            />
          </Link>

          {(() => {
            const isFav = user?.data?.profile?.favorites?.some(
              (fav) => String(fav.mediaId) === String(media.id),
            );

            return (
              <HeartIcon
                onClick={() => {
                  if (isGuest) {
                    Swal.fire({
                      title: "Login Required",
                      text: "You can't add favorites as a guest!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#E11D48", // لون أحمر متناسب مع Tailwind
                      confirmButtonText: "Go to Login",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        userLogout(); // أو استخدام navigate
                      }
                    });
                    return;
                  }
                  // إذا لم يوجد media_type، نستنتج أنه 'tv' إذا كان لديه 'name'
                  // أو 'movie' إذا كان لديه 'title'
                  const detectedType =
                    media.media_type || (media.title ? "movie" : "tv");

                  isFav
                    ? deletedFromFavorite(String(media.id))
                    : addToFavorites(media.id, detectedType);
                }}
                weight={isFav ? "fill" : "regular"}
                className={`absolute top-0 left-1 size-7 hover:text-red-500 transition-all duration-300 cursor-pointer 
    ${isFav ? "fill-red-500 text-red-500" : "text-white"}`}
              />
            );
          })()}
        </div>
        <h6 className="pt-1 text-md md:text-md">{media.title || media.name}</h6>
        <p
          className={`absolute top-0 right-0 p-2 bg-bgTransparent ${
            Number.isInteger(Math.round(media.vote_average * 10) / 10)
              ? "px-3.5"
              : ""
          }`}
        >
          {Math.round(media.vote_average * 10) / 10}
        </p>
      </>
    );
  }
  return (
    <ShardLinks.Provider value={{ linksMedia }}>
      {props.children}
    </ShardLinks.Provider>
  );
}
