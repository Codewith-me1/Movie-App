"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SkeletonLoader from "../others/skeletonLoader";

interface UpcomingMovie {
  id: string;
  overview: string;
  title: string;
  backdrop_path: string;
  poster_path: string;
}

const MovieScroll = () => {
  const [upcoming, SetUpcoming] = useState<UpcomingMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile view for width < 768px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/home/upcoming");
        const data = await response.json();

        setTimeout(() => setLoading(false), 2000);

        SetUpcoming(data || []);
        console.log(data);
      } catch (error) {
        console.log("API ERROR" + error);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="scroll mx-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={30}
        autoplay
        slidesPerView={1}
        className="w-full h-[35rem]"
      >
        {upcoming?.slice(0, 5).map((movie) => (
          <SwiperSlide>
            <div className="container w-full h-full">
              <div className="Poster w-full h-[35rem] relative flex flex-col justify-between">
                {loading && (
                  <SkeletonLoader className="w-full absolute inset-0" />
                )}

                {!loading && (
                  <img
                    src={
                      movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                        : `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                    }
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <div className="relative z-10 p-4 bg-gradient-to-t from-black/70 to-transparent h-full flex flex-col justify-end">
                  <h1 className="text-white font-sans text-3xl font-bold">
                    {movie.title}
                  </h1>

                  <div className="text-md text-zinc-300 mt-2">
                    {isMobile
                      ? `${movie.overview.slice(0, 100)}...`
                      : movie.overview}
                  </div>

                  {isMobile && (
                    <Link href={`/movie/${movie.id}`}>
                      <Button className="mt-2 text-white bg-gray-800 hover:bg-gray-700">
                        View More
                      </Button>
                    </Link>
                  )}

                  <div className="bottomCon hidden lg:flex gap-4 mt-4">
                    <Button className="bg-white hover:bg-zinc-700 hover:text-white">
                      <PlayCircle /> Watch Trailer
                    </Button>
                    <Link href={`/movie/${movie.id}`}>
                      <Button className="text-white">More Info</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieScroll;
