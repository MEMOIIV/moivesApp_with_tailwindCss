/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { layerLoading } from "../../utils/card";
import { Link } from "react-router-dom";
import { ApiContext, APIUser, ShardLinks } from "../../context/context";
import { HeartIcon } from "../../utils/icons";
import TvShow from "../TvShow/TvShow";
function Home() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  // const [user, setUser] = useState(null);
  const { apiKey, isGuest } = useContext(ApiContext);
  const { getUserData, user } = useContext(APIUser);
  const { linksMedia } = useContext(ShardLinks);

  // Get all Trending Movies
  async function getTrendingMovies() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
    );
    // let allMovies = data.results; // i can not save data in a normal variable because i want make data render after all update so i will save data is state by useState
    setMovies(data.results);
  }

  // Get all Trending Tv Show
  async function getTrendingTvShow() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`,
    );
    setTvShows(data.results);
  }

  useEffect(() => {
    // component Did Mount \\
    getTrendingMovies();
    getTrendingTvShow();
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {user == null ? (
        ""
      ) : (
        <div className="mt-defaultPadding w-[90%] mx-auto text-3xl">
          <h2>Hello {user.data.profile.firstName}</h2>
        </div>
      )}
      {!isGuest ? (
        ""
      ) : (
        <div className="mt-defaultPadding w-[90%] mx-auto text-3xl">
          <h2>Hello Guest </h2>
        </div>
      )}

      {/* Movies show */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 w-[90%] m-auto px-4 gap-4 ${user == null && !isGuest ? "mt-defaultPadding" : "mt-10"}`}
      >
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
                  {linksMedia(movie)}
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
                {linksMedia(tvShow)}
              </div>
            ))
          : layerLoading(10)}
      </div>
    </>
  );
}

export default Home;
