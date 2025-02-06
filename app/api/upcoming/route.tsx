import { NextResponse } from "next/server";

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

const currentDate = `${year}-${month}-${day}`;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&primary_release_date.gte=${currentDate}&sort_by=popularity.desc&page=${
        page ? page : "1"
      }`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
        },
      }
    );
    const data = await response.json();

    const baseUrl = req.headers.get("host").startsWith("localhost")
      ? `http://${req.headers.get("host")}`
      : `https://${req.headers.get("host")}`;
    const detailedMoviesData = await Promise.all(
      data.results.map(async (movie) => {
        try {
          const getId = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/external_ids?adult=true`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
              },
            }
          );
          const getData = await getId.json();

          const rating = await fetch(
            `${baseUrl}/api/rating?id=${getData.imdb_id}`
          );
          const ratingData = await rating.json();

          return {
            ...movie,

            imdb_id: getData.imdb_id,
            externalData: getData,
            lan: ratingData,
          };
        } catch (error) {
          console.log("API Error" + error);
          return {
            newData: error,
          };
        }
      })
    );

    return NextResponse.json(detailedMoviesData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "There hasbeen some error" + error });
  }
}
