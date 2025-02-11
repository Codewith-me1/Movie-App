import { adminAuth, setAdminClaim } from "@/app/firebase/admin";
import { getUserWatchlist } from "@/app/firebase/adminDb"; // Import Watchlist function
import { NextResponse } from "next/server";

type WatchlistItem = {
  ID: string;
  Type: "movie" | "show";
};

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const userToken = await adminAuth.verifyIdToken(idToken);
    console.log("Verified");

    const uid = userToken.uid;

    if (!userToken.admin) {
      await setAdminClaim(uid);
      console.log("Admin claim set for user:", uid);
    }

    const watchlistItems: WatchlistItem[] = await getUserWatchlist(uid); // Fetch watchlist items

    // Fetch movie/show details
    const movieDetails = await Promise.all(
      watchlistItems.map(async (item: WatchlistItem) => {
        const { ID, Type } = item;
        let details = null;

        const url =
          Type === "show"
            ? `https://api.themoviedb.org/3/tv/${ID}`
            : `https://api.themoviedb.org/3/movie/${ID}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
          },
        });

        if (response.ok) {
          details = await response.json();
        } else {
          console.error(`Failed to fetch ${Type} with ID ${ID}`);
        }

        return details ? { ID, Type, details } : null;
      })
    );

    // Filter out null results
    const filteredData = movieDetails.filter((item) => item !== null);

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
