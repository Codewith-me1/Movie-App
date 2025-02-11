// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import React, { useState } from "react";
// import { useEffect } from "react";

// const List = () => {
//   const [movieData, setMovieData] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [genre, setGenre] = useState("");
//   const [rating, setRating] = useState(0);
//   const [user, setUser] = useState(null);
//   const [userGen, setUserGen] = useState(null);

//   const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&page=${page}&with_genres=${genre}&vote_average.gte=${rating}`;

//   //fetch movie list Data With No Custom Params
//   useEffect(() => {
//     const fetchMovies = async () => {
//       if (!hasMore || loading) return;
//       setLoading(true);

//       try {
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             accept: "application/json",
//             Authorization: `Bearer `,
//           },
//         });
//         const movieData = await response.json();
//         if (!movieData.results.length) setHasMore(false);
//         else {
//           setMovieData((prevData) =>
//             page === 1 ? movieData.results : [...prevData, ...movieData.results]
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching movies:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMovies();
//   }, [page, genre, rating, userGen]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//           document.body.offsetHeight - 100 &&
//         hasMore &&
//         !loading
//       ) {
//         setPage((prevPage) => prevPage + 1);
//         console.log(page);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [loading, hasMore]);

//   const handleData = (selectedGenre, selectedRating) => {
//     setRating(selectedRating);
//     setGenre(selectedGenre);
//     setPage(1);
//     setHasMore(true);
//   };

//   return (
//     <>
//       <div className="movie_cards  font-poppins grid mx-[6rem] grid-cols-4 gap-x-5 gap-y-10 ">
//         {movieData.map((movie, id) => (
//           <Card key={id} className="glossy-effect">
//             <div className="p-5 border-none">
//               <div className="movie_image">
//                 <img
//                   src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
//                   alt={movie.title}
//                   className="rounded-sm"
//                 />
//               </div>

//               <div className="icon_div mt-2 flex items-center">
//                 <img
//                   src="/icons/star.svg"
//                   className="w-[2.2rem]"
//                   alt="Rating"
//                 />
//                 <p className="ml-2 text-lg">{movie.vote_average.toFixed(1)}</p>
//               </div>
//               <div className="movie_data mt-[0.3rem]">
//                 <h1 className="text-">{movie.title}</h1>
//                 <Button className="w-full  bg-slate-400 mt-7">
//                   <a href={`/movie/${movie.id}`}>View</a>
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </>
//   );
// };

// export default List;
