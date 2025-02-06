import { NextResponse } from "next/server";

const TMDB_AUTH_KEY = process.env.TMDB_AUTH_KEY;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  try {
    // Fetch OTT shows (e.g., Netflix in the US)
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?language=en-US&page=${
        page ? page : "1"
      }&with_watch_providers=8&watch_region=US`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_AUTH_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch OTT series. Status: ${response.status}`);
    }

    const data = await response.json();

    // Fetch detailed data for top 20 shows

    // Return the processed data
    return NextResponse.json(data.results);
  } catch (error) {
    console.error("Error in fetching OTT series:", error.message);
    return NextResponse.json(
      {
        error: `An error occurred while fetching data: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
