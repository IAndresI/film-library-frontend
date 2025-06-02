import { Route, Routes, useLocation } from "react-router-dom";
import { HomeMainPage } from "@/pages/home/home/ui/HomeMainPage";
import { FilmPage } from "@/pages/home/film/ui/FilmPage";
import { AnimatePresence } from "framer-motion";
import { FilmCategoryPage } from "@/pages/home/film-category/ui/FilmCategoryPage";
import { NewFilmsPage } from "@/pages/home/new-films/ui/NewFilmsPage";
import { UserFavoritesPage } from "@/pages/home/user-favorites/ui/UserFavoritesPage";
import { ActorsPage } from "@/pages/home/actors/ui/ActorsPage";
import { ActorPage } from "@/pages/home/actor/ui/ActorPage";
import { UserReviewsPage } from "@/pages/home/user-reviews/ui/UserReviewsPage";
import { SearchPage } from "@/pages/home/search/ui/SearchPage";

export const HomePage = () => {
  const location = useLocation();

  const locationArr = location.pathname?.split("/") ?? [];

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={locationArr[1]}>
        <Route element={<HomeMainPage />} path="/" />
        <Route element={<FilmPage />} path="/film/:id" />
        <Route element={<NewFilmsPage />} path="/films/new" />
        <Route element={<ActorsPage />} path="/actors" />
        <Route element={<ActorPage />} path="/actors/:id" />
        <Route element={<UserFavoritesPage />} path="/favorites" />{" "}
        <Route element={<UserReviewsPage />} path="/reviews" />
        <Route element={<SearchPage />} path="/search" />
        <Route
          element={<FilmCategoryPage />}
          path="/films/genres/:categoryId"
        />
      </Routes>
    </AnimatePresence>
  );
};
