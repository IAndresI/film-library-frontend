import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

import { HomeHeader } from '@/pages/home/ui/HomeHeader';
import { HomeSidebar } from '@/pages/home/ui/HomeSidebar';

import { SidebarProvider } from '@/shared/ui/sidebar';

export const HomeLayout = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={'home_layout'}
    >
      <SidebarProvider>
        <HomeSidebar />
        <div className="h-[100svh] w-full overflow-auto">
          <HomeHeader />
          <main className="bg-background grid flex-1 grid-cols-3 lg:grid-cols-4">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </motion.div>
  );
};
