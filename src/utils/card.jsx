import { Link } from "react-router-dom";
import { HeartBreakIcon } from "./icons";
import { ApiContext } from "../context/context";

export function layerLoading(countOfArray) {
  let carton;
  for (let i = 0; i < 10; i++) {
    return Array(countOfArray)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="relative animate-pulse">
          <div className="h-79 md:h-60 lg:h-79 bg-gray-700 rounded-md"></div>
          <div className="h-2 bg-gray-700 mt-3 rounded-md w-3/4"></div>
          <div className="h-2 bg-gray-700 mt-2 rounded-md w-1/2"></div>
        </div>
      ));
  }
  return carton;
}

export function loadingSpan() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
    </div>
  );
}

export function listIsEmpty(isGuest, logout) {
  return (
    <div className="w-[90%] m-auto pb-10 flex flex-col items-center justify-center py-20 text-center">
      <div className="text-2xl font-bold text-white mb-2 flex items-center">
        <h2 className="mx-2"> Your favorites list is empty </h2>
        <HeartBreakIcon />
      </div>
      <p className="text-gray-400 mb-8 text-lg">
        Start adding movies and TV shows you want to watch later.
      </p>
      {isGuest ? (
        <button
          onClick={logout}
          className="bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-all duration-300 cursor-pointer"
        >
          Go to Login
        </button>
      ) : (
        <Link
          to="/"
          className="bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-all duration-300"
        >
          Browse Trending Now
        </Link>
      )}
    </div>
  );
}
