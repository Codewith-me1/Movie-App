import { NextResponse } from "next/server";

const TMDB_AUTH_KEY = process.env.TMDB_AUTH_KEY;

type TVShow = {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  networks?: { name: string }[];
  episode_run_time?: number[];
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  try {
    // Fetch OTT shows
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?language=en-US&page=${
        page || "1"
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

    const baseUrl = req.headers.get("host")?.startsWith("localhost")
      ? `http://${req.headers.get("host")}`
      : `https://${req.headers.get("host")}`;

    const data: { results: TVShow[] } = await response.json();

    // Fetch detailed data for top 20 shows
    const detailedShows = await Promise.all(
      data.results.slice(0, 20).map(async (show: TVShow) => {
        try {
          const showDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${show.id}?language=en-US`,
            {
              headers: {
                Authorization: `Bearer ${TMDB_AUTH_KEY}`,
              },
            }
          );

          if (!showDetailsResponse.ok) {
            throw new Error(
              `Failed to fetch details for show ID ${show.id}. Status: ${showDetailsResponse.status}`
            );
          }

          const detailedData: TVShow = await showDetailsResponse.json();

          // Calculate total runtime
          const totalRuntime =
            (detailedData.episode_run_time?.reduce((a, b) => a + b, 0) || 0) *
            (detailedData.number_of_episodes || 0);

          // Fetch external IDs
          const external = await fetch(
            `https://api.themoviedb.org/3/tv/${show.id}/external_ids`,
            {
              headers: {
                Authorization: `Bearer ${TMDB_AUTH_KEY}`,
              },
            }
          );

          const external_id = await external.json();

          // Fetch IMDb rating
          const rating = await fetch(
            `${baseUrl}/api/rating?id=${external_id.imdb_id}`
          );
          const ratingData = await rating.json();

          return {
            ...show,
            seasons: detailedData.number_of_seasons,
            rating: ratingData.imdbRating,
            externalId: external_id,
            imdb_id: external_id.imdb_id,
            lan: ratingData,
            totalRuntime,
            total_epi: detailedData.number_of_episodes,
            network: detailedData.networks?.map((net) => net.name).join(", "),
          };
        } catch (error) {
          console.error(
            `Error fetching details for show ID ${show.id}:`,
            error
          );
          return { id: show.id, error: `Failed to fetch detailed info.` };
        }
      })
    );

    // Return the processed data
    return NextResponse.json(detailedShows);
  } catch (error: any) {
    console.error("Error in fetching OTT series:", error);
    return NextResponse.json(
      {
        error: `An error occurred while fetching data: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
