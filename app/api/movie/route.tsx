import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY; // Use an environment variable for security

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page: page ? page : 1,
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
