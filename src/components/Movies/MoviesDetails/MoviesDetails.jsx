/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadingSpan } from "../../../utils/card";

export default function MoviesDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [collectionMovies, setCollectionMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // details movie
  async function getDetails() {
    setLoading(true);
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=ab6f02890a894dfd18b04c025b5de2eb`,
    );
    setDetails(data);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
  // similar movies
  async function similarMovie() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=ab6f02890a894dfd18b04c025b5de2eb`,
    );
    setSimilarMovies(data.results.slice(0, 10));
  }
  // collection mof movies
  async function getCollection() {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/collection/${details?.belongs_to_collection?.id}?api_key=ab6f02890a894dfd18b04c025b5de2eb`,
    );
    setCollectionMovies(data.parts);
  }

  useEffect(() => {
    getDetails();
    similarMovie();
  }, [id]);

  useEffect(() => {
    if (details?.belongs_to_collection?.id) {
      getCollection();
    }
  }, [details]);

  return (
    <>
      {loading || details == null ? (
        loadingSpan()
      ) : (
        <div className=" w-[90%] m-auto capitalize">
          <div className="pt-25.75 pb-12 grid grid-cols-12 gap-8 ">
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <img
                src={
                  details.poster_path
                    ? "https://image.tmdb.org/t/p/w500" + details.poster_path
                    : "/No-Image.png"
                }
                className="w-full"
                alt="poster movie"
                onError={(e) => (e.target.src = "/No-Image.png")}
              />
            </div>
            <div className="col-span-12 md:col-span-7 lg:col-span-8 pt-4 space-y-6 w-[80%]">
              <h3 className="text-4xl">{details.original_title}</h3>
              <p className="text-gray-400 text-xl">{details.tagline}</p>
              <div className="flex flex-wrap gap-3">
                {details.genres?.map((genre) => (
                  <button
                    key={genre.id}
                    className="px-2 rounded bg-bgTransparent text-white capitalize text-md"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
              <p
                className={`${
                  Number.isInteger(Math.round(details.vote_average * 10) / 10)
                    ? "px-3.5"
                    : ""
                }`}
              >
                vote average : {Math.round(details.vote_average * 10) / 10}
              </p>
              <p>vote count : {details.vote_count}</p>
              <p>popularity : {details.popularity}</p>
              <p>release data : {details.release_date}</p>
              <p className="text-gray-400 leading-8">{details.overview}</p>
            </div>
          </div>
          {/* Same Collection */}
          {details.belongs_to_collection != null ? (
            <div>
              <h2 className="text-3xl">From the Same Collection :</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
                {collectionMovies.map((movie, index) => {
                  return (
                    <div key={index}>
                      <Link to={`/details/${movie.id}`}>
                        <img
                          src={
                            movie.poster_path
                              ? "https://image.tmdb.org/t/p/w500" +
                                movie.poster_path
                              : "/No-Image.png"
                          }
                          className="rounded-md"
                          onError={(e) => (e.target.src = "/No-Image.png")}
                          alt="poster movie"
                        />
                      </Link>
                      <h4 className="mt-2 text-xl md:text-lg">{movie.title}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Also Like */}
          <div className="mt-4">
            <h3 className="text-3xl">You May Also Like :</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 my-4 gap-4">
              {similarMovies.length != 0
                ? similarMovies.map((movie, index) => {
                    return (
                      <div key={index}>
                        <Link to={`/details/${movie.id}`}>
                          <img
                            src={
                              movie.poster_path
                                ? "https://image.tmdb.org/t/p/w500" +
                                  movie.poster_path
                                : "/No-Image.png"
                            }
                            className="rounded-md sm:h-100"
                            onError={(e) => (e.target.src = "/No-Image.png")}
                            alt="poster movie"
                          />
                        </Link>
                        <h4 className="mt-2 text-xl md:text-lg">
                          {movie.title}
                        </h4>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// https://api.themoviedb.org/3/movie/{movie_id}/similar?api_key=YOUR_API_KEY
