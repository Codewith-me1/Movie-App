"use client";

import { useCarousel } from "@/app/hooks/carousel";
import { ArrowBigRight, ArrowBigLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import SkeletonLoader from "../others/skeletonLoader";
import Link from "next/link";

interface Upcoming {
  id: number;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  title: string;
}

const Upcoming = () => {
  const { carouselRef, scrollRight, scrollLeft } = useCarousel();
  const [error, SetError] = useState("");
  const [movies, setMovie] = useState<Upcoming[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);

  const handleLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/home/upcoming");
        const data = await response.json();

        setTimeout(handleLoading, 1000);
        setMovie(data || []);
      } catch (error: any) {
        console.log("There Has Been Some Error Please Try Again Later" + error);
        SetError(error);
      }
    };
    fetchUpcoming();
  }, []);

  const handleScroll = () => {
    if (carouselRef.current) {
      setShowLeftButton(carouselRef.current.scrollLeft > 0);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", handleScroll);
      }
    };
  }, [carouselRef]);

  return (
    <div className="w-full font-sans relative">
      <div className="main_container ">
        <h1 className="text-3xl px-10 my-10 font-bold">Coming Soon</h1>
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-hidden px-10 select-none"
          >
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} id="upcoming">
                <div
                  key={movie.id}
                  className="comingSoonCard flex-shrink-0 w-[25rem] rounded-lg  shadow-lg group transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out relative"
                >
                  {loading && <SkeletonLoader className="w-full h-full" />}
                  {!loading && (
                    <div className="relative ">
                      <img
                        draggable="false"
                        className="w-[25rem] h-[18rem] object-cover rounded-md group-hover:brightness-75 transition-all duration-300 ease-in-out"
                        src={
                          movie.backdrop_path
                            ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                            : `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                        }
                        alt={movie.title}
                      />
                      <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out p-4 bg-gradient-to-t from-black via-transparent">
                        <h1 className="text-white text-xl font-semibold">
                          {movie.title}
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1">
                          Opening At&nbsp;
                          <span className="text-white font-medium">
                            {new Intl.DateTimeFormat("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(movie.release_date))}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
            {isHovered && (
              <>
                <button
                  onClick={scrollRight}
                  className="absolute text-center p-[0.8rem] right-5 top-1/2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
                >
                  <ArrowBigRight size={30} />
                </button>
                {showLeftButton && (
                  <button
                    onClick={scrollLeft}
                    className="absolute text-center p-[0.8rem] left-5 top-1/2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
                  >
                    <ArrowBigLeft size={30} />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
