"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useCarousel } from "@/app/hooks/carousel";
import {
  ArrowBigRight,
  ArrowBigLeft,
  Clock,
  GalleryVerticalEnd,
  TimerResetIcon,
} from "lucide-react";
import Link from "next/link";

interface Shows {
  id: number;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  title: string;
  total_epi: number;
  seasons: number;
}

const NewReleases = () => {
  const [newReleases, setNewReleases] = useState<Shows[]>([]);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const { carouselRef, scrollRight, scrollLeft } = useCarousel();

  useEffect(() => {
    const fetchNewShows = async () => {
      try {
        const response = await fetch("/api/shows");
        const data = await response.json();
        if (data) {
          setNewReleases(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchNewShows();
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
        <h1 className="text-3xl px-10 my-10 font-bold">New Shows</h1>
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-hidden px-10  select-none"
          >
            {newReleases.map((show) => (
              <Link
                key={show.id}
                href={`/tvshow/${show.id}`}
                className="flex-shrink-0"
              >
                <Card
                  key={show.id}
                  className="min-w-[14rem] w-[17rem] p-[1rem] flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    draggable="false"
                    className="w-full h-[17rem] object-cover rounded-md hover:scale-[1.5] transform transition-transform duration-300 ease-in-out  "
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.title}
                  />
                  <div className="p-2 text-center flex justify-between">
                    <p className="text-sm px-[10px] py-[5px] flex border-[0.1px] border-gray-800 text-zinc-400 items-center bg-zinc-900 rounded-[1rem]">
                      <span className="flex gap-1 text-zinc-400 font-medium">
                        <TimerResetIcon size={20} />
                        {show.total_epi}
                      </span>
                      EP
                    </p>

                    <p className="text-sm px-[10px] py-[5px] flex border-[0.1px] border-gray-800 text-zinc-400 items-center bg-zinc-900 rounded-[1rem]">
                      <span className="text-zinc-400 flex gap-1 align-middle items-center font-medium">
                        <GalleryVerticalEnd size={20} />
                        {show.seasons} &nbsp;
                      </span>
                      Seasons
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
};

export default NewReleases;
