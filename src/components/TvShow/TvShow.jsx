/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { layerLoading } from "../../utils/card";
import { Link } from "react-router-dom";
import { ApiContext, ShardLinks } from "../../context/context";

function TvShow() {
  const [allTvShow, setAllTvShow] = useState([]);
  const [page, setPage] = useState(1);
  const { apiKey } = useContext(ApiContext);
  const { linksMedia } = useContext(ShardLinks);

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
            return <div key={index} className="relative">{linksMedia(tvShow)}</div>;
          })}
    </section>
  );
}

export default TvShow;
