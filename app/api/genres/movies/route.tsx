import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const page = searchParams.get("page");
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&with_genres=${id}&page=${
        page ? page : 1
      }`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
        },
      }
    );
    const genreData = await response.json();

    return NextResponse.json(genreData);
  } catch (error) {
    console.error("API ERROR" + error);
  }
}
