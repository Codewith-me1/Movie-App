import axios from "axios";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?language=en'`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error,
    });
  }
}
