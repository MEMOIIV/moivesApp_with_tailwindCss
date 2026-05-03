/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadingSpan } from "../../utils/card";
import { ApiContext, ShardLinks } from "../../context/context";
export default function Details() {
  const { id, media } = useParams();
  const [details, setDetails] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [collections, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(null);
  const { apiKey } = useContext(ApiContext);
  const { linksMedia } = useContext(ShardLinks);

  // details movie
  async function getDetails() {
    setLoading(true);
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/${media}/${id}?api_key=${apiKey}`,
    );
    setDetails(data);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
  // similar movies
  async function similarMovie() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/${media}/${id}/similar?api_key=${apiKey}`,
    );
    setSimilar(data.results.slice(0, 10));
  }
  // collection mof movies
  async function getCollection() {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/collection/${details?.belongs_to_collection?.id}?api_key=${apiKey}`,
    );
    setCollection(data.parts);
  }

  // Get Video trailer Movies \\
  async function videoMovieTrailer() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media}/${id}/videos?api_key=${apiKey}`,
      );
      let trailer = data.results.find((video) => {
        return video.type === "Trailer" && video.site === "YouTube";
      });
      if (trailer) setVideoKey(trailer.key);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setVideoKey(null);
    getDetails();
    similarMovie();
    videoMovieTrailer();
  }, [id, media]);

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
        <div className=" w-[90%] m-auto capitalize pb-8">
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
              <h3 className="text-4xl">
                {media == "movie" ? details.original_title : details.name}
              </h3>
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
              <p>vote average : {Math.round(details.vote_average * 10) / 10}</p>
              <p>vote count : {details.vote_count}</p>
              <p>popularity : {details.popularity}</p>
              <p>release data : {details.release_date}</p>
              <p className="text-gray-400 leading-8">{details.overview}</p>
            </div>
          </div>
          {/* Same Collection for movie Or seasons for tvShoe*/}
          {/* collections */}
          {details.belongs_to_collection != null ? (
            <div>
              <h2 className="text-3xl">From the Same Collection :</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
                {collections.map((collection, index) => {
                  return (
                    <div key={index}>
                      <Link to={`/details/${media}/${collection.id}`}>
                        <img
                          src={
                            collection.poster_path
                              ? "https://image.tmdb.org/t/p/w500" +
                                collection.poster_path
                              : "/No-Image.png"
                          }
                          className="rounded-md"
                          onError={(e) => (e.target.src = "/No-Image.png")}
                          alt="poster movie"
                        />
                      </Link>
                      <h4 className="mt-2 text-xl md:text-lg">
                        {media == "movie" ? collection.title : collection.name}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}

          {/* video trailer */}
          <h2 className="text-4xl py-4">Official Trailer :</h2>
          {videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}`}
              frameBorder="0"
              className="w-full m-auto h-125 my-3"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-gray-400 text-g mt-3 mb-4 px-3">
              No trailer available
            </p>
          )}

          {/* seasons */}
          {media === "tv" && details.seasons?.length > 0 ? (
            <div>
              <h2 className="text-3xl pt-10 pb-5">Series Seasons :</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
                {details.seasons.map((season, index) => {
                  return (
                    <div key={index} className="relative">
                      <Link>
                        <img
                          src={
                            season.poster_path
                              ? "https://image.tmdb.org/t/p/w500" +
                                season.poster_path
                              : "/No-Image.png"
                          }
                          className="rounded-md h-100 w-full"
                          onError={(e) => (e.target.src = "/No-Image.png")}
                          alt="poster movie"
                        />
                      </Link>
                      <div className="mt-2 text-xl md:text-lg flex">
                        <h4>{season.name}</h4>
                      </div>
                      <h4 className="absolute top-0 right-0 bg-lightBgColor px-2 py-0.5 rounded-bl-sm">
                        episode: {season.episode_count}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Also Like */}
          <div>
            <h3 className="text-3xl py-8">You May Also Like :</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {similar.length != 0
                ? similar.map((allSimilar, index) => {
                    return <div key={index}>{linksMedia(allSimilar)}</div>;
                  })
                : ""}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// OIokcsEfcxbHfvg7
