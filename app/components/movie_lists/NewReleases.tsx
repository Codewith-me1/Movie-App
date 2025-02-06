"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowBigRight } from "lucide-react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/api/movie");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        console.log("Error fetching movies:", err.message);
        setError("Failed to load movies. Please try again later.");
      }
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    };

    const handleMouseUp = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    };

    if (carousel) {
      carousel.addEventListener("mousedown", handleMouseDown);
      carousel.addEventListener("mouseleave", handleMouseLeave);
      carousel.addEventListener("mouseup", handleMouseUp);
      carousel.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("mousedown", handleMouseDown);
        carousel.removeEventListener("mouseleave", handleMouseLeave);
        carousel.removeEventListener("mouseup", handleMouseUp);
        carousel.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full font-sans relative">
      <div className="main_container ml-60">
        <h1 className="text-3xl px-10 my-10 font-bold">New Releases</h1>
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-hidden px-10  select-none"
          >
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                id="movie"
                className="flex-shrink-0"
              >
                <Card className="min-w-[12rem] p-[1rem] rounded-lg overflow-hidden shadow-lg">
                  <img
                    draggable="false"
                    className="w-full h-[16rem] object-cover rounded-md"
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
          </div>
        )}
      </div>
    </div>
  );
}
