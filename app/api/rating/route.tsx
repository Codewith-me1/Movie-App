import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const rating = await fetch(
      `https://www.omdbapi.com/?i=${id}&apiKey=${process.env.OMDB_API_KEY}`
    );
    const response = await rating.json();

    return NextResponse.json(response);
  } catch (error) {
    console.error("API ERROR" + error);
  }
}
