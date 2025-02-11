"use client";

import Like from "@/app/components/features/Like";
import ShareComponent from "@/app/components/features/Share";
import Watchlist from "@/app/components/features/Watchlist";
import Provider from "@/app/components/provider/provider";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ShowData {
  id: string;
  title: string;
  backdrop_path?: string;
  name: string;
  poster_path?: string;
  overview: string;
  production_companies: { name?: string }[];
}

interface RatingData {
  imdbRating?: string;
  Ratings?: { Source: string; Value: string }[];
  Genre?: string;
  Language?: string;
  Director?: string;
  totalSeasons: string;
  Writer?: string;
}

interface ShowResponse {
  data: ShowData;
  ratingData: RatingData;
}

const Page = () => {
  const { id } = useParams();
  const [tv, settv] = useState<ShowResponse | null>(null);

  const [streaming, updatedStreaming] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchtv = async () => {
      try {
        const response = await fetch(`/api/page/movie?id=${id}&type=tv`);
        if (!response.ok) {
          throw new Error("Failed to fetch tv details");
        }
        const data = await response.json();
        settv(data);
        console.log(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchtv();
  }, [id]);

  useEffect(() => {
    const fetchIP = async () => {
      const response = await fetch("/api/location");
      const data = await response.json();

      try {
        const provider = await fetch(`/api/tv?id=${id}`);
        const providerData = await provider.json();

        const watchProvider = providerData.results[data.country];
        updatedStreaming(watchProvider);
      } catch (error) {
        console.log("Not Available in Your Region" + error);
      }
    };
    fetchIP();
  }, []);

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if (!tv) {
    return <h1>Loading...</h1>;
  }

  // useEffect(() => {
  //   fetch("https://ip-api.com/json/")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       alert(data.country);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching the country data:", error);
  //     });
  // }, []);
  return (
    <div className="relative w-full bg-black text-white font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 h-screen">
        <img
          src={
            tv.data.backdrop_path
              ? `https://image.tmdb.org/t/p/original/${tv.data.backdrop_path}`
              : `https://image.tmdb.org/t/p/original/${tv.data.poster_path}`
          }
          alt={tv.data.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181023] via-transparent to-[#181023] opacity-95"></div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col justify-end h-screen pb-[15rem] px-6 md:px-16 lg:px-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{tv.data.name}</h1>
        <p className="text-lg md:text-xl mb-6 max-w-6xl">{tv.data.overview}</p>

        {/* Buttons */}
        <div className="flex gap-5">
          <div className="flex gap-3 flex-col items-center">
            <img className="w-10" alt="IMDB" src="/icons/imdb.svg" />
            <p className="font-bold">{tv.ratingData.imdbRating || "N/A"}</p>
          </div>

          {tv.ratingData.Ratings?.map((rating, index) =>
            rating.Source === "Rotten Tomatoes" ? (
              <div key={index} className="flex flex-col gap-3 items-center">
                <img
                  className="w-10"
                  src="/icons/tomato.svg"
                  alt="Rotten Tomatoes"
                />
                <p className="font-bold">{rating.Value}</p>
              </div>
            ) : null
          )}
        </div>

        <div className="flex text-lg mt-5 tracking-widest">
          {tv.ratingData.Genre?.replaceAll(",", " . ") || "Genre not available"}
        </div>
        <div className="flex items-center space-x-4 mt-10">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-lg text-lg font-semibold">
            <Like likeId={tv.data.id} type="show" />
          </button>
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-lg font-semibold">
            <Watchlist type="show" watchListId={tv.data.id} />
          </button>

          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-lg font-semibold">
            <ShareComponent type="tvshow" id={tv.data.id} />
          </button>
        </div>
      </div>

      {/* More Info Section */}
      <div className="moreInfo font-sans pt-10 pb-40 px-8 relative z-10 bg-[#181023]">
        <div className="w-[50%]">
          <Provider type="tv" id={id} />
        </div>

        <div className="tvDetails space-y-10 my-8 ml-5">
          <div>
            <h1 className="text-lg font-bold">Audio Languages</h1>
            <div className="Languages mt-2 ">
              {tv.ratingData.Language ? (
                <p>{tv.ratingData.Language}</p>
              ) : (
                <p>No language information available</p>
              )}
            </div>
          </div>
        </div>

        <div className="tvDetails space-y-10 my-8 ml-5">
          <div>
            <h1 className="text-lg font-bold">Production</h1>
            <div className="Production mt-2">
              {tv.data.production_companies.map(
                (product) => (
                  <p>
                    {product.name ? product.name : "No Information Available"}
                  </p>
                )
                // product.name ? (
                //   <p>{product.name}</p>
                // ) : (
                //   <p>No Information Available</p>
                // );
              )}
            </div>
          </div>
        </div>

        <div className="tvDetails space-y-10 my-8 ml-5">
          <div>
            <h1 className="text-lg font-bold">Seasons</h1>
            <div className="Directors mt-2">
              {tv.ratingData.totalSeasons ? (
                <p>{tv.ratingData.totalSeasons}</p>
              ) : (
                <p>No information available</p>
              )}
            </div>
          </div>
        </div>

        <div className="tvDetails space-y-10 my-8 ml-5">
          <div>
            <h1 className="text-lg font-bold">Directors</h1>
            <div className="Directors mt-2">
              {tv.ratingData.Director ? (
                <p>{tv.ratingData.Director}</p>
              ) : (
                <p>No information available</p>
              )}
            </div>
          </div>
        </div>

        <div className="tvDetails space-y-10 my-8 ml-5">
          <div>
            <h1 className="text-lg font-bold">Writers</h1>
            <div className="Writers mt-2">
              {tv.ratingData.Writer ? (
                <p>{tv.ratingData.Writer}</p>
              ) : (
                <p>No information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
