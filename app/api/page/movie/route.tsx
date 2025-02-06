import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const baseUrl = req.headers.get("host").startsWith("localhost")
    ? `http://${req.headers.get("host")}`
    : `https://${req.headers.get("host")}`;

  const response = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
      },
    }
  );

  const data = await response.json();

  const ratingData = async (data) => {
    try {
      const getId = await fetch(
        `https://api.themoviedb.org/3/${type}/${data.id}/external_ids?adult=true`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
          },
        }
      );

      const external_id = await getId.json();

      const rating = await fetch(
        `${baseUrl}/api/rating?id=${external_id.imdb_id}`
      );

      const ratingData = await rating.json();

      return {
        data,
        ratingData: ratingData,
      };
    } catch (error) {
      return {
        text: "API ERROR" + error,
      };
    }
  };

  const rating = await ratingData(data);

  return NextResponse.json(rating);
}
