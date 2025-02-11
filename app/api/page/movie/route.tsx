import { NextResponse } from "next/server";

type MediaData = {
  id: number;
  title?: string; // Movies use "title"
  name?: string; // TV shows use "name"
  overview: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  const baseUrl = req.headers.get("host")?.startsWith("localhost")
    ? `http://${req.headers.get("host")}`
    : `https://${req.headers.get("host")}`;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch media data" },
        { status: response.status }
      );
    }

    const data: MediaData = await response.json(); // Explicitly typed

    const ratingData = async (data: MediaData) => {
      try {
        const getId = await fetch(
          `https://api.themoviedb.org/3/${type}/${data.id}/external_ids?adult=true`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
            },
          }
        );

        if (!getId.ok) {
          return { error: "Failed to fetch external IDs" };
        }

        const external_id = await getId.json();

        const rating = await fetch(
          `${baseUrl}/api/rating?id=${external_id.imdb_id}`
        );

        if (!rating.ok) {
          return { error: "Failed to fetch rating data" };
        }

        const ratingData = await rating.json();

        return {
          data,
          ratingData,
        };
      } catch (error) {
        return { error: "API ERROR: " + error };
      }
    };

    const rating = await ratingData(data);

    return NextResponse.json(rating);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
