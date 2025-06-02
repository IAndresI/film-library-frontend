import { Outlet } from "react-router-dom";
import { HomeHeader } from "@/pages/home/ui/HomeHeader";
import { motion } from "framer-motion";
import { SidebarProvider } from "@/shared/ui/sidebar";
import { HomeSidebar } from "@/pages/home/ui/HomeSidebar";

export const HomeLayout = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"home_layout"}
    >
      <SidebarProvider>
        <HomeSidebar />
        <div className="h-[100svh] w-full overflow-auto">
          <HomeHeader />
          <main className="bg-background grid flex-1 grid-cols-3 border-t lg:grid-cols-4">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </motion.div>
  );
};
