"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowBigRight, ArrowBigLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCarousel } from "@/app/hooks/carousel";
import SkeletonLoader from "../others/skeletonLoader";

const Genres_List = () => {
  const [genres, setGenres] = useState([]);
  const { carouselRef, scrollRight, scrollLeft } = useCarousel();
  const [error, setError] = useState(null);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);

  const handleLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    async function fetchGenres() {
      try {
        setLoading(true);
        const response = await fetch("/api/genres");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTimeout(handleLoading, 2000);
        setGenres(data.genres || []);
      } catch (err) {
        console.log("Error fetching genres:", err.message);
        setError("Failed to load genres. Please try again later.");
      }
    }

    fetchGenres();
  }, []);

  useEffect(() => {
    if (!genres.length) return;

    const fetchMovies = async () => {
      const moviePromises = genres.map(async (genre) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre.id}`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOTVkN2EyMzkyMTA0YWMwNTNlNTYxN2IxYWRiY2I4MiIsIm5iZiI6MTczMTg1Mzg0MS4xNDU0MzQ2LCJzdWIiOiI2NzA5MzQxYWVlOTYxNDg1ODcyNGRlOGQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0hQ8wAMZcT47ro0fyhip2tUok-5c_CdxWkbafWSCnO4`,
              },
            }
          );
          const data = await response.json();
          return { genreId: genre.id, movies: data.results.slice(0, 4) };
        } catch (err) {
          console.error(
            `Error fetching movies for genre ${genre.id}:`,
            err.message
          );
          return { genreId: genre.id, movies: [] };
        }
      });

      const results = await Promise.all(moviePromises);
      const moviesMap = results.reduce((acc, { genreId, movies }) => {
        acc[genreId] = movies;
        return acc;
      }, {});
      setMoviesByGenre(moviesMap);
    };

    fetchMovies();
  }, [genres]);

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
        <h1 className="text-3xl px-10 my-10 font-bold">Our Genres</h1>
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-hidden px-10 cursor-grab active:cursor-grabbing select-none"
          >
            {genres.map((genre) => (
              <Link href={`/genres/${genre.id}`} key={genre.id}>
                <Card className="min-w-[13rem] p-[1rem] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                  <div className="grid grid-cols-2 p-2 gap-4">
                    {moviesByGenre[genre.id]?.map((movie) => (
                      <div
                        key={movie.id}
                        className="movie-poster relative rounded-sm overflow-hidden w-20 h-20"
                      >
                        {loading && (
                          <SkeletonLoader className="w-full h-full" />
                        )}
                        {!loading && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            draggable="false"
                            className="absolute w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="genre_section2 mb-4 mt-4 flex items-center justify-between">
                    <h1 className="font-bold text-lg">{genre.name}</h1>
                    <ArrowRight />
                  </div>
                </Card>
              </Link>
            ))}
            {isHovered && (
              <>
                {showLeftButton && (
                  <button
                    onClick={scrollLeft}
                    className="absolute text-center p-[0.8rem] left-5 top-1/2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
                  >
                    <ArrowBigLeft size={30} />
                  </button>
                )}
                <button
                  onClick={scrollRight}
                  className="absolute text-center p-[0.8rem] right-5 top-1/2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
                >
                  <ArrowBigRight size={30} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres_List;
