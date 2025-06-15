import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { authApi } from '@/features/auth/api';

import { UserContext } from '@/entities/user';

import { SvgLogo } from '@/shared/ui/svg/SvgLogo';

export const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
  } = useQuery(authApi.getAuthQueryOptions());

  const locationArr = location.pathname?.split('/') ?? [];

  useEffect(() => {
    if (isError || (isSuccess && !user)) {
      navigate('/authentication');
    }
  }, [isError, isSuccess, user, navigate]);

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
            <Outlet key={locationArr[1] === 'admin' ? 1 : 2} />
          </motion.div>
        </UserContext.Provider>
      )}
    </AnimatePresence>
  );
};
