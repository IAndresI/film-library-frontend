import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

import { OrderPage } from '@/pages/order';

import { AdminActorEditorPage } from '../actors/ui/AdminActorEditorPage';
import { AdminActorsPage } from '../actors/ui/AdminActorsPage';
import { AdminFilmCreationPage } from '../films/ui/AdminFilmCreationPage';
import { AdminFilmEditorPage } from '../films/ui/AdminFilmEditorPage';
import { AdminFilmsPage } from '../films/ui/AdminFilmsPage';
import { AdminOrdersPage } from '../orders/ui/AdminOrdersPage';
import { AdminReviewsPage } from '../reviews/ui/AdminReviewsPage';
import { AdminSubscriptionsPage } from '../subscriptions/ui/AdminSubscriptionsPage';
import { AdminUserInfoPage } from '../users/ui/AdminUserInfoPage';
import { AdminUsersPage } from '../users/ui/AdminUsersPage';

export const AdminPage = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={location.pathname}
      >
        {/* <Route element={<AdminHomePage />} path="/" /> */}
        <Route
          element={<AdminFilmsPage />}
          path="/films"
        />
        <Route
          element={<AdminFilmCreationPage />}
          path="/films/adding"
        />
        <Route
          element={<AdminFilmEditorPage />}
          path="/films/:id"
        />
        <Route
          element={<AdminUsersPage />}
          path="/users"
        />
        <Route
          element={<AdminUserInfoPage />}
          path="/users/:id"
        />
        <Route
          element={<AdminReviewsPage />}
          path="/reviews"
        />
        <Route
          element={<AdminReviewsPage reviewsOnModeration />}
          path="/reviews/on-approve"
        />
        <Route
          element={<AdminActorsPage />}
          path="/actors"
        />
        <Route
          element={<AdminActorEditorPage />}
          path="/actors/adding"
        />
        <Route
          element={<AdminActorEditorPage />}
          path="/actors/:id"
        />
        <Route
          element={<AdminSubscriptionsPage />}
          path="/"
        />
        <Route
          element={<AdminOrdersPage />}
          path="/orders"
        />
        <Route
          element={<OrderPage isAdmin />}
          path="/orders/:orderId"
        />
      </Routes>
    </AnimatePresence>
  );
};
