/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { layerLoading } from "../../utils/card";
import { Link, Outlet } from "react-router-dom";
import { ApiContext } from "../../context/context";

export default function Movies() {
  const [allMovies, setAllMovies] = useState([]);
  const [pages, setPages] = useState(1);
  const { apiKey } = useContext(ApiContext);

  async function getAllMovies() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${pages}`,
    );
    const newMoviesList = data.results;
    setAllMovies((currentMovies) => [...currentMovies, ...newMoviesList]);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getAllMovies();

    function handleScroll() {
      const section = document.querySelector("section");

      if (
        window.innerHeight + window.scrollY >=
        section.offsetTop + section.offsetHeight - 200
      ) {
        setPages((prev) => prev + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pages]);

  return (
    <>
      <section className="w-[90%] m-auto mt-defaultPadding pb-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {allMovies.length != 0
          ? allMovies.map((movies, index) => (
              <div key={index} className="relative">
                <Link to={`/details/movie/${movies.id}`}>
                  <img
                    src={
                      movies.poster_path != null
                        ? "https://image.tmdb.org/t/p/w500" + movies.poster_path
                        : "/No-Image.png"
                    }
                    className="w-full"
                    onError={(e) => (e.target.src = "/No-Image.png")}
                    alt="image"
                  />
                </Link>
                <h6 className="pt-1">{movies.title}</h6>
                <p
                  className={`absolute top-0 right-0 p-2 bg-bgTransparent ${
                    Number.isInteger(Math.round(movies.vote_average * 10) / 10)
                      ? "px-3.5"
                      : ""
                  }`}
                >
                  {Math.round(movies.vote_average * 10) / 10}
                </p>
              </div>
            ))
          : layerLoading(20)}
      </section>
      <Outlet />
    </>
  );
}
