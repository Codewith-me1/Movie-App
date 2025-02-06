"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const SkeletonLoader = () => {
  return (
    <div className="skeleton-card w-[12rem] h-[18rem] bg-gray-300 rounded-md animate-pulse"></div>
  );
};

const Movie = ({ params }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  const id = params.id; // Dynamic id from props

  const handleImagesLoaded = () => {
    setSkeletonVisible(false); // Hide skeleton after images are loaded
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      setSkeletonVisible(true); // Show skeleton immediately when loading starts

      try {
        const response = await fetch(
          `/api/genres/movies?id=${id}&page=${page}`
        );
        const data = await response.json();
        console.log(data);

        if (!data.results.length) {
          setHasMore(false);
        } else {
          setTimeout(() => {
            setMovies((prevData) =>
              page === 1 ? data.results : [...prevData, ...data.results]
            );
            setTimeout(() => handleImagesLoaded(), 500); // Add a grace period
          }, 1000);
        }
      } catch (error) {
        console.log("API ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, id]); // Dependency array includes id

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 500 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="w-full">
      <div className="card_con flex gap-6 flex-row flex-wrap px-10 w-full h-full">
        {/* Movie Cards */}
        {movies.map((movie, index) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} id="movie">
            <div key={index} className="cards">
              <img
                draggable="false"
                className="h-[18rem] object-cover rounded-md"
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                alt={movie.title}
              />
            </div>
          </Link>
        ))}

        {/* Skeleton Loader */}
        {skeletonVisible &&
          Array(6) // Number of skeletons
            .fill(0)
            .map((_, index) => <SkeletonLoader key={index} />)}
      </div>
    </div>
  );
};

export default Movie;
