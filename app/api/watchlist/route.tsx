import { adminAuth, setAdminClaim } from "@/app/firebase/admin";
import { getUserWatchlist } from "@/app/firebase/adminDb"; // Import Watchlist function
import { NextResponse } from "next/server";

export async function GET(req) {
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

    const watchlistItems = await getUserWatchlist(uid); // Fetch watchlist items

    // Fetch movie/show details
    const movieDetails = await Promise.all(
      watchlistItems.map(async (item) => {
        const { ID, Type } = item;
        let details = null;

        if (Type === "show") {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${ID}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
              },
            }
          );
          if (response.ok) {
            details = await response.json();
          } else {
            console.error(`Failed to fetch show with ID ${ID}`);
          }
        } else if (Type === "movie") {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${ID}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
              },
            }
          );
          if (response.ok) {
            details = await response.json();
          } else {
            console.error(`Failed to fetch movie with ID ${ID}`);
          }
        } else {
          console.warn(`Unknown Type: ${Type}`);
        }

        return details ? { ID, Type, details } : { ID, Type, details: null };
      })
    );

    // Filter out null details
    const filteredData = movieDetails.filter((item) => item.details !== null);

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json({ error });
  }
}
