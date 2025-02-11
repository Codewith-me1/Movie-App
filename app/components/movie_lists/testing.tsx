"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowBigRight, ArrowBigLeft } from "lucide-react";
import { useCarousel } from "@/app/hooks/carousel";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

export default function Testing() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const { carouselRef, scrollRight, scrollLeft } = useCarousel();
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/api/movie");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err: any) {
        console.log("Error fetching movies:", err.message);
        setError("Failed to load movies. Please try again later.");
      }
    }

    fetchMovies();
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
      <div className="main_container">
        <h1 className="text-3xl px-10 my-10 font-bold">New Releases</h1>
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-hidden px-10 select-none"
          >
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                id="movie"
                type="movie"
                className="flex-shrink-0"
              >
                <Card className="min-w-[12rem] p-[1rem] rounded-lg overflow-hidden shadow-lg">
                  <img
                    draggable="false"
                    className="w-full h-[16rem] object-cover rounded-md transform transition-transform duration-300 ease-in-out hover:scale-[1.6]"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />

                  <div className="p-2 text-center">
                    <p className="text-sm mt-2 text-zinc-400 bg-zinc-900 w-full px-5 py-2 rounded-[1rem]">
                      Released At
                      <span className="text-white font-medium">
                        {" "}
                        {movie.release_date}
                      </span>
                    </p>
                  </div>
                </Card>
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
}
