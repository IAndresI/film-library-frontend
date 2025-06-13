import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

import { ActorPage } from '@/pages/home/actor/ui/ActorPage';
import { ActorsPage } from '@/pages/home/actors/ui/ActorsPage';
import { FilmPage } from '@/pages/home/film/ui/FilmPage';
import { FilmsPage } from '@/pages/home/films/ui/FilmsPage';
import { HomeMainPage } from '@/pages/home/home/ui/HomeMainPage';
import { SearchPage } from '@/pages/home/search/ui/SearchPage';
import { UserFavoritesPage } from '@/pages/home/user-favorites/ui/UserFavoritesPage';
import { UserReviewsPage } from '@/pages/home/user-reviews/ui/UserReviewsPage';
import { OrderPage } from '@/pages/order';
import { ProfilePage } from '@/pages/profile';

import { MyFilmsPage } from '../myFilms/ui/MyFilmsPage';
import { PremiumPage } from '../premium';

export const HomePage = () => {
  const location = useLocation();

  const locationArr = location.pathname?.split('/') ?? [];

  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={locationArr[1]}
      >
        <Route
          element={<HomeMainPage />}
          path="/"
        />

        <Route
          element={<ActorsPage />}
          path="/actors"
        />
        <Route
          element={<ActorPage />}
          path="/actors/:id"
        />

        <Route
          element={<UserFavoritesPage />}
          path="/favorites"
        />

        <Route
          element={<UserReviewsPage />}
          path="/reviews"
        />

        <Route
          element={<SearchPage />}
          path="/search"
        />

        <Route
          element={<PremiumPage />}
          path="/premium"
        />

        <Route
          element={<OrderPage />}
          path="/profile/orders/:orderId"
        />
        <Route
          element={<ProfilePage />}
          path="/profile/*"
        />

        <Route
          element={<FilmPage />}
          path="/film/:id"
        />
        <Route
          element={<FilmsPage />}
          path="/films"
        />
        <Route
          element={<FilmsPage />}
          path="/films/genres/:categoryId"
        />
        <Route
          element={<MyFilmsPage />}
          path="/my-films"
        />
      </Routes>
    </AnimatePresence>
  );
};
