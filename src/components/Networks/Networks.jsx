/* eslint-disable react-hooks/set-state-in-effect */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../context/context";
import { layerLoading } from "./../../utils/card";
import { Link } from "react-router-dom";

// https://image.tmdb.org/t/p/w500
export default function Networks() {
  let { apiKey } = useContext(ApiContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const networks = [
    { id: 49, name: "HBO" },
    { id: 213, name: "Netflix" },
    { id: 174, name: "AMC" },
    { id: 19, name: "FOX" },
    { id: 1024, name: "Amazon Prime Video" },
    { id: 2739, name: "Disney+" },
    { id: 2552, name: "Apple TV+" },
  ];

  async function getHOBTvShow() {
    setLoading(true);
    try {
      const results = await Promise.all(
        networks.map(async (net) => {
          // tv shows
          const tv = await axios.get(
            `https://api.themoviedb.org/3/discover/tv`,
            {
              params: {
                api_key: apiKey,
                with_networks: net.id,
              },
            },
          );

          // logo
          const info = await axios.get(
            `https://api.themoviedb.org/3/network/${net.id}`,
            {
              params: {
                api_key: apiKey,
              },
            },
          );

          return {
            shows: tv.data.results,
            logo: info.data.logo_path,
          };
        }),
      );

      setData(results);
    } catch (error) {
      console.log(error);
      setLoading(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getHOBTvShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <section className="mt-defaultPadding w-[90%] mx-auto pb-4">
        {data.map((net, i) => (
          <div key={i} className="my-10">
            {/* logo */}
            <img
              src={`https://image.tmdb.org/t/p/w500${net.logo}`}
              className="w-60 mb-4"
            />

            {/* shows */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {loading
                ? layerLoading(20)
                : net.shows.map((show) => (
                    <Link to={`/details/tv/${show.id}`} key={show.id}>
                      <img
                        src={
                          show.poster_path
                            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                            : "/No-Image.png"
                        }
                        className="rounded"
                      />
                      <h3>{show.name}</h3>
                    </Link>
                  ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
