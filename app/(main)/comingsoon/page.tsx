"use client";

import SkeletonLoader from "@/app/components/others/skeletonLoader";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  release_date: string;
  lan?: {
    Genre?: string;
  };
}

const Coming = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     if (!hasMore || loading) return;

  //     setLoading(true);
  //     setSkeletonVisible(true);
  //     try {
  //       const response = await fetch(`/api/upcoming`);
  //       const data = await response.json();

  //       if (!data.length) {
  //         setHasMore(false);
  //       } else {
  //         setTimeout(() => {
  //           setSkeletonVisible(false);
  //         }, 1000);

  //         // setMovies((prevData) =>
  //         //   page === 1 ? data.results : [...prevData, ...data.results]
  //         // );
  //         setMovies(data.results);
  //         console.log(movies);
  //       }
  //     } catch (error) {
  //       console.log("API ERROR" + error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchMovies();
  // }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!hasMore || loading) return;

      setLoading(true);
      setSkeletonVisible(true);

      try {
        const response = await fetch(`api/upcoming?page=${page}`);
        const data = await response.json();
        console.log(data);
        if (!data.length) {
          setHasMore(false);
        } else {
          setTimeout(() => {
            setSkeletonVisible(false);
          }, 1000);
          setMovies((prevData) => (page === 1 ? data : [...prevData, ...data]));
          // setMovies(data || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 1000 &&
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
    <div className="mt-20">
      <div className="card_container  flex gap-20 flex-row flex-wrap justify-center px-10 w-full h-full">
        {movies?.map((movie, key) => (
          <div className=" w-[100%]  xl:w-[40%] lg:w-[70%] rounded-lg flex lg:flex-row flex-col  bg-[#1c1e31] border-zinc-600">
            <div className="image_container w-[100%] lg:w-[35%] p-5">
              {skeletonVisible && <SkeletonLoader className="w-full h-full" />}
              {!skeletonVisible && (
                <img
                  draggable="false"
                  key={key}
                  alt={movie.name}
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="w-full h-[17rem] object-cover rounded-md"
                />
              )}
            </div>

            <div className="content w-[60%] font-sans ml-2 mt-5 p-5 lg:p-0">
              <h1 className="text-xl ">{movie.title}</h1>

              <p className="flex mt-10 text-zinc-400 ">
                <span className="text-zinc-200">
                  {" "}
                  Genres- &nbsp; {movie.lan?.Genre}
                </span>
              </p>

              <p className="text-sm mt-2 text-zinc-400  w-full  rounded-[1rem]">
                Releasing At &nbsp;
                <span className="text-white font-medium">
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(movie.release_date))}
                </span>
              </p>

              <div className="button_con  items-end mt-6 mb-4 flex gap-5">
                <Link id="comingsoon" href={`/movie/${movie.id}`}>
                  <Button className="text-white">
                    {" "}
                    <Info /> More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coming;
