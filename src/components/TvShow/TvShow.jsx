/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { layerLoading } from "../../utils/card";
import { Link } from "react-router-dom";
import { ApiContext } from "../../context/context";

function TvShow() {
  const [allTvShow, setAllTvShow] = useState([]);
  const [page, setPage] = useState(1);
  const { apiKey } = useContext(ApiContext);

  async function getAllTvShow() {
    try {
      let { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=${page}`,
      );
      let newTvShowList = data.results;
      setAllTvShow((currentTvShow) => {
        return [...currentTvShow, ...newTvShowList];
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllTvShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      const section = document.querySelector("section");

      if (
        window.innerHeight + window.scrollY >=
        section.offsetTop + section.offsetHeight - 200
      ) {
        setPage((currentPageNumber) => currentPageNumber + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="text-white mt-defaultPadding w-[90%] m-auto pb-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
      {allTvShow.length == 0
        ? layerLoading(20)
        : allTvShow.map((tvShow, index) => {
            return (
              <div key={index}>
                <Link to={`/details/tv/${tvShow.id}`}>
                  <img
                    src={
                      tvShow.poster_path != null
                        ? "https://image.tmdb.org/t/p/w500" + tvShow.poster_path
                        : "/No-Image.png"
                    }
                    className="w-full"
                    onError={(e) => (e.target.src = "/No-Image.png")}
                    alt="image"
                  />
                </Link>
                <h6 className="pt-1">{tvShow.name}</h6>
                <p
                  className={`absolute top-0 right-0 p-2 bg-bgTransparent ${
                    Number.isInteger(Math.round(tvShow.vote_average * 10) / 10)
                      ? "px-3.5"
                      : ""
                  }`}
                >
                  {Math.round(tvShow.vote_average * 10) / 10}
                </p>
              </div>
            );
          })}
    </section>
  );
}

export default TvShow;
