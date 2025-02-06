// import { adminAuth } from "@/app/firebase/admin";
// import { getUserLikes, Likes } from "@/app/firebase/database";
// import { NextResponse } from "next/server";

import { adminAuth, setAdminClaim } from "@/app/firebase/admin";
import { Likes } from "@/app/firebase/adminDb";
import { NextResponse } from "next/server";
import Like from "@/app/components/features/Like";
import Movie from "@/app/(main)/movie/page";

// export async function GET(req) {
//   const authHeader = req.headers.get("Authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json(
//       { error: "Missing or invalid Authorization header" },
//       { status: 401 }
//     );
//   }

//   const idToken = authHeader.split("Bearer ")[1];

//   try {
//     const userToken = await adminAuth.verifyIdToken(idToken);
//     console.log("Verified");

//     const uid = userToken.uid;

//     if (!userToken.admin) {
//       await setAdminClaim(uid);
//       console.log("Admin claim set for user:", uid);
//     }

//     const likedIds = await Likes(uid);

//     const movieDetails = await Promise.all(
//       likedIds.map(async (item) => {
//         // Separate logic based on Type (show/movie)
//         if (item.Type === "show") {
//           const response = await fetch(
//             `https://api.themoviedb.org/3/tv/${item.ID}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
//               },
//             }
//           );
//           if (!response.ok) {
//             console.error(`Failed to fetch show with ID ${item.ID}`);
//             return null;
//           }
//           return await response.json();
//         } else if (item.Type === "movie") {
//           const response = await fetch(
//             `https://api.themoviedb.org/3/movie/${item.ID}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`,
//               },
//             }
//           );
//           if (!response.ok) {
//             console.error(`Failed to fetch movie with ID ${item.ID}`);
//             return null;
//           }
//           return await response.json();
//         } else {
//           console.warn(`Unknown Type: ${item.Type}`);
//           return null;
//         }
//       })
//     );

//     // Filter out any null entries due to failed fetch requests
//     const filteredDetails = movieDetails.filter((detail) => detail !== null);

//     const Data = [likedIds, filteredDetails];

//     return NextResponse.json(Data);
//   } catch (error) {
//     console.log("AN ERRRO occured" + error);

//     return NextResponse.json({ error });
//   }
// }

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

    const likedIds = await Likes(uid);

    // Fetch movie/show details along with ID and Type
    const movieDetails = await Promise.all(
      likedIds.map(async (item) => {
        const { ID, Type } = item; // Extract ID and Type
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

        // Return details along with ID and Type
        return details ? { ID, Type, details } : { ID, Type, details: null };
      })
    );

    // Filter out null details
    const filteredData = movieDetails.filter((item) => item.details !== null);

    return NextResponse.json(filteredData);
  } catch (error) {
    console.log("An error occurred:", error);

    return NextResponse.json({ error });
  }
}
