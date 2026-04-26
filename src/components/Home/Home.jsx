import axios from "axios";
import React, { useEffect, useState } from "react";
import { layerLoading } from "../../utils/card";
import { Link } from "react-router-dom";
// json-server --watch db.json --port 3000
function Home() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  let apiKey = "ab6f02890a894dfd18b04c025b5de2eb";

  async function getTrendingMovies() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
    );
    // let allMovies = data.results; // i can not save data in a normal variable because i want make data render after all update so i will save data is state by useState
    setMovies(data.results);
  }

  async function getTrendingTvShow() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`,
    );
    setTvShows(data.results);
  }

  useEffect(() => {
    // component Did Mount \\
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getTrendingMovies();
    getTrendingTvShow();
  }, []);

  return (
    <>
      {/* Movies show */}
      <div className="mt-defaultPadding grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-[90%] m-auto px-4 gap-4">
        <div
          className="relative row-span-1 col-span-1 md:col-span-1 xl:col-span-2
        before:content-[''] before:absolute before:top-0 before:w-[20%] before:h-px before:bg-borderColor
        after:content-[''] after:absolute after:bottom-0 after:w-[90%] md:after:w-[90%] lg:after:w-[95%] after:h-px after:bg-borderColor h-fit"
        >
          <h3 className="text-3xl capitalize font-normal mt-5">
            trending <p>movies</p>{" "}
            <p className="first-letter:lowercase">to watch now</p>
          </h3>
          <p className="text-[16px] my-5 text-gray-500">
            most watched movies by days
          </p>
        </div>

        {movies.length != 0
          ? movies.map((movie, index) => {
              return (
                <div key={index} className="relative">
                  <Link to={`/details/${movie.id}`}>
                    <img
                      src={
                        "https://image.tmdb.org/t/p/w500" + movie.poster_path
                      }
                      className="w-full"
                      alt="image"
                    />
                  </Link>
                  <h6 className="pt-1">{movie.original_title}</h6>
                  <p
                    className={`absolute top-0 right-0 p-2 bg-bgTransparent ${
                      Number.isInteger(Math.round(movie.vote_average * 10) / 10)
                        ? "px-3.5"
                        : ""
                    }`}
                  >
                    {Math.round(movie.vote_average * 10) / 10}
                  </p>
                </div>
              );
            })
          : layerLoading(10)}
      </div>

      {/* Tv show */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-[90%] m-auto p-4 gap-4">
        <div
          className="relative row-span-1 col-span-1 md:col-span-1 xl:col-span-2
        before:content-[''] before:absolute before:top-0 before:w-[20%] before:h-px before:bg-borderColor
        after:content-[''] after:absolute after:bottom-0 after:w-[90%] md:after:w-[90%] lg:after:w-[95%] after:h-px after:bg-borderColor h-fit"
        >
          <h3 className="text-3xl capitalize font-normal mt-5">
            trending <p>tv</p>{" "}
            <p className="first-letter:lowercase">to watch now</p>
          </h3>
          <p className="text-[16px] my-5 text-gray-500">
            most watched tvShows by days
          </p>
        </div>

        {tvShows.length != 0
          ? tvShows.map((tvShow, index) => (
              <div key={index} className="relative">
                <Link to={`/details${tvShow.id}`}>
                  {" "}
                  <img
                    src={"https://image.tmdb.org/t/p/w500" + tvShow.poster_path}
                    className="w-full"
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
            ))
          : layerLoading(10)}
      </div>
    </>
  );
}

export default Home;
