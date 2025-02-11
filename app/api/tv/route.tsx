import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/watch/providers`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
        },
      }
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json("API ERROR");
  }
}
