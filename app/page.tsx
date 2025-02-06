import React, { Suspense } from "react";
import List from "./components/movie_lists/list";
import Home from "./components/movie_lists/NewReleases";
import Genres_List from "./components/movie_lists/genres";
import NewReleases from "./components/movie_lists/NewShows";
import Upcoming from "./components/movie_lists/upcoming";
import { AnimatedGradientBorderTW } from "./components/new";
import SideNav from "./layout/sidenav";
import Layout from "./layout/layout";
import MovieScroll from "./components/movie_lists/firstScroll";
import { Footer } from "./layout/footer";

const Testing = React.lazy(() => import("./components/movie_lists/testing"));
const Movie = React.lazy(() => import("./components/movie_lists/firstScroll"));
const page = () => {
  return (
    <>
      <Layout>
        <MovieScroll />

        <Genres_List />
        <Suspense>
          <Testing />
        </Suspense>
        <NewReleases />
        <Upcoming />
        <Footer />
      </Layout>
    </>
  );
};

export default page;
