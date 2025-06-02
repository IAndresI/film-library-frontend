import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AdminFilmsPage } from "../films/ui/AdminFilmsPage";
import { AdminUsersPage } from "../users/ui/AdminUsersPage";
import { AdminHomePage } from "../home/ui/AdminHomePage";

export const AdminPage = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AdminHomePage />} path="/" />
        <Route element={<AdminFilmsPage />} path="/films" />
        <Route element={<AdminUsersPage />} path="/users" />
      </Routes>
    </AnimatePresence>
  );
};
