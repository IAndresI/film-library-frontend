import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AdminFilmsPage } from "../films/ui/AdminFilmsPage";
import { AdminUsersPage } from "../users/ui/AdminUsersPage";
import { AdminHomePage } from "../home/ui/AdminHomePage";
import { AdminFilmEditorPage } from "../films/ui/AdminFilmEditorPage";
import { AdminReviewsPage } from "../reviews/ui/AdminReviewsPage";
import { AdminActorsPage } from "../actors/ui/AdminActorsPage";
import { AdminActorEditorPage } from "../actors/ui/AdminActorEditorPage";
import { AdminUserInfoPage } from "../users/ui/AdminUserInfoPage";

export const AdminPage = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AdminHomePage />} path="/" />
        <Route element={<AdminFilmsPage />} path="/films" />
        <Route element={<AdminFilmEditorPage />} path="/films/adding" />
        <Route element={<AdminFilmEditorPage />} path="/films/:id" />
        <Route element={<AdminUsersPage />} path="/users" />
        <Route element={<AdminUserInfoPage />} path="/users/:id" />
        <Route element={<AdminReviewsPage />} path="/reviews" />
        <Route
          element={<AdminReviewsPage isOnApprove />}
          path="/reviews/on-approve"
        />
        <Route element={<AdminActorsPage />} path="/actors" />
        <Route element={<AdminActorEditorPage />} path="/actors/adding" />
        <Route element={<AdminActorEditorPage />} path="/actors/:id" />
      </Routes>
    </AnimatePresence>
  );
};
