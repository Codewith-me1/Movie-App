"use client";

import SkeletonLoader from "@/app/components/others/skeletonLoader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import Like from "@/app/components/features/Like";
import Watchlist from "@/app/components/features/Watchlist";
import ShareComponent from "@/app/components/features/Share";

interface Show {
  id: string;
  name: string;
  poster_path: string;
  rating: number;
  genre_ids: number[];
  lan: { Language: string };
  seasons: number;
}

interface Genre {
  id: number;
  name: string;
}

const TvShow = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!hasMore || loading) return;

      setLoading(true);
      setSkeletonVisible(true);
      try {
        const response = await fetch(`/api/newshows?page=${page}`);
        const data = await response.json();

        if (!data.length) {
          setHasMore(false);
        } else {
          setTimeout(() => {
            setSkeletonVisible(false);
          }, 1000);

          setShows((prevData) => (page === 1 ? data : [...prevData, ...data]));
        }
      } catch (error) {
        console.log("API ERROR" + error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("api/genres");
        const data = await response.json();

        setGenres(data.genres || []);
      } catch (error) {
        console.log("API ERROR" + error);
      }
    };
    fetchGenres();
  }, []);

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

  const genreName = (id: number) => {
    const filterdData = genres.filter((m) => {
      return m.id === id;
    });

    return filterdData[0]?.name;
  };

  return (
    <div className="mt-20">
      <div className="card_container flex gap-10 lg:gap-20  flex-row flex-wrap justify-center px-10 w-full h-full">
        {shows?.map((show, key) => (
          <div
            key={key}
            className=" w-full md:w-[35rem] rounded-xl flex flex-col md:flex-row  bg-[#3e4050] "
          >
            <div className="side_container md:w-[30rem] rounded-lg flex flex-col md:flex-row bg-[#1c1e31]">
              <div className="image_container w-full md:w-[15rem] sm:w-1/2 p-4">
                {skeletonVisible && (
                  <SkeletonLoader className="w-full h-full" />
                )}

                {!skeletonVisible && (
                  <img
                    draggable="false"
                    alt={show.name}
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    className="w-full h-auto object-cover rounded-md"
                  />
                )}
              </div>

              <div className="content sm:w-1/2 p-4 md:w-[60%] font-sans ml-2 mt-5">
                <h1 className="text-xl ">{show.name}</h1>

                <div className="ratings mt-4 md:mt-1">
                  <div className="ratingCard flex items-center md:items-start md:flex-col">
                    <img
                      src="/icons/imdb.svg"
                      className="w-10 h-7 md:w-[40px] md:h-[30px] md:mt-5"
                      alt="IMDB"
                    />
                    <p className="ml-2 md:mt-1">{show.rating}</p>
                  </div>
                </div>

                <p className="flex mt-2 text-zinc-400 ">
                  <span className="text-zinc-200"> Genres- &nbsp; </span>
                  {show.genre_ids.map((id) => (
                    <p>{genreName(id)} &nbsp; </p>
                  ))}
                </p>
                <p className="mt-2 ">
                  Language:{" "}
                  <span className="text-zinc-400 border-zinc-200 border-1 ">
                    {" "}
                    {show.lan.Language}{" "}
                  </span>
                </p>
                <p className="mt-2">Seasons: &nbsp; {show.seasons}</p>

                <div className="button_con  mt-6 mb-4 flex gap-5">
                  <Link href={`/tvshow/${show.id}`} id="show" key={show.id}>
                    <Button className="text-white">
                      {" "}
                      <Info /> More Info
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="second_container flex flex-row md:flex-col justify-center p-4 md:m-4 items-center   gap-10">
              <Like type="show" likeId={show.id} />
              <Watchlist type="show" watchListId={show.id} />
              <ShareComponent type="tvshow" id={show.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TvShow;
