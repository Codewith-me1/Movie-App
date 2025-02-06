"use client";

import SkeletonLoader from "@/app/components/others/skeletonLoader";
import { useAuth } from "@/app/context/AuthChecker";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Like from "@/app/components/features/Like";
import Watchlist from "@/app/components/features/Watchlist";

const Page = () => {
  const { user } = useAuth();
  const auth = getAuth();
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true); // Tracks loading state

  useEffect(() => {
    if (!user) return;

    const fetchMovies = async () => {
      setLoading(true); // Show skeleton loader
      const idToken = await auth.currentUser?.getIdToken();

      try {
        const response = await fetch(`/api/playlist`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const data = await response.json();

        if (data) {
          setMovieData(data); // Update movie data
        }
      } catch (error) {
        console.error("There has been some error:", error);
      } finally {
        setLoading(false); // Hide skeleton loader
      }
    };

    fetchMovies();
  }, [user, auth]);

  return (
    <div>
      <div className="flex items-center max-w-[1100px] mx-auto my-8">
        <div className="h-[3px] flex-1 bg-white"></div>
        <h2 className="px-8 text-lg">Playlist</h2>
        <div className="h-[3px] flex-1 bg-white"></div>
      </div>
      <div className="card_con flex gap-6  flex-row flex-wrap px-10 w-full h-full">
        {/* Movie Cards */}
        {!loading && movieData.length > 0
          ? movieData.map((movie) => (
              <div
                key={movie.details.id}
                className="relative group  mb-10 cards"
              >
                <Link href={`/movie/${movie.details.id}`} id="movie">
                  <img
                    draggable="false"
                    className="h-[18rem] object-cover group-hover:scale-[1.2] transform transition-transform duration-300 ease-in-out rounded-md"
                    src={`https://image.tmdb.org/t/p/original/${movie.details.poster_path}`}
                    alt={movie.title}
                  />
                </Link>
                {/* Dropdown on Hover */}
                <div className="absolute bottom-[-1] left-0 w-full p-2 bg-black bg-opacity-75 rounded-b-md opacity-0 group-hover:opacity-100 group-hover:scale-[1.2] group-hover:translate-y-0 transform translate-y-full transition-all duration-300 ease-in-out">
                  <div className="flex justify-around">
                    <Like type={movie.Type} likeId={movie.details.id} />
                    <Watchlist type={movie.Type} watchListId={movie.ID} />
                  </div>
                </div>
              </div>
            ))
          : null}

        {/* Skeleton Loaders */}
        {loading &&
          Array(6) // Number of skeletons to display
            .fill(0)
            .map((_, index) => (
              <SkeletonLoader class="w-full h-full" key={index} />
            ))}
      </div>
    </div>
  );
};

export default Page;
