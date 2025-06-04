import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SvgLogo } from "@/shared/ui/svg/SvgLogo";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "@/app/providers";
import { authApi } from "@/features/auth/api";

export const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: user,
    isLoading,
    isSuccess,
  } = useQuery(authApi.getAuthQueryOptions());

  const locationArr = location.pathname?.split("/") ?? [];

  useEffect(() => {
    if (!isSuccess || (!isSuccess && !user)) {
      navigate("/authentication");
    }
  }, [isSuccess, user, navigate]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="bg-background fixed inset-0 z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SvgLogo className="animate-pulse" />
        </motion.div>
      )}
      {user && !isLoading && (
        <UserContext.Provider value={user}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Outlet key={locationArr[1] === "admin" ? 1 : 2} />
          </motion.div>
        </UserContext.Provider>
      )}
    </AnimatePresence>
  );
};
