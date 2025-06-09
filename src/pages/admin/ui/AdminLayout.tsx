import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { motion } from "framer-motion";
import { SidebarProvider } from "../../../shared/ui/sidebar";
import { useUser } from "@/app/providers";

export const AdminLayout = () => {
  const user = useUser();
  const navigate = useNavigate();

  if (!user || !user.isAdmin) {
    navigate("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      key={"admin_layout"}
    >
      <SidebarProvider>
        <AdminSidebar />

        <div className="h-[100svh] w-full overflow-auto">
          <AdminHeader />

          <main className="bg-background grid flex-1 lg:grid-cols-4">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </motion.div>
  );
};
