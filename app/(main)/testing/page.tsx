"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserLikes, Likes } from "@/app/firebase/database";
import { useAuth } from "@/app/context/AuthChecker";

const Page = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  const handleClick = () => {
    auth.signOut();
    alert("Signed Out successfully");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("User is signed in:", user.displayName);
      } else {
        setCurrentUser(null);
        console.log("No user signed in");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <>
      <p>
        {currentUser
          ? `Welcome, ${currentUser.displayName}`
          : "No user signed in"}
      </p>
      <button onClick={handleClick}>Logout</button>
    </>
  );
};

export default Page;

// const Page = () => {
//   const { user } = useAuth();
//   const auth = getAuth();
//   const [movieData, updatedMovieData] = useState([]);

//   useEffect(() => {
//     if (!user) return;

//     const fetchMovies = async () => {
//       const idToken = await auth.currentUser?.getIdToken();

//       console.log(idToken);

//       try {
//         const response = await fetch(`/api/watchlist`, {
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//           },
//         });
//         const data = await response.json();
//         updatedMovieData(data);

//         console.log(data);
//       } catch (error) {
//         console.log("There Has Been Some Error" + error);
//       }
//     };

//     fetchMovies();
//   }, [user, auth]);
//   return (
//     <div>
//       <div className="container">
//         {movieData.map((movie) => (
//           <h1>{movie.details.title}</h1>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Page;
