import { AuthLayout } from "../pages/authentication/ui/AuthLayout.tsx";
import { AdminLayout } from "../pages/admin/ui/AdminLayout.tsx";
import { createBrowserRouter } from "react-router-dom";
import { AuthenticationPage } from "@/pages/authentication";
import { AdminPage } from "@/pages/admin";
import { HomePage } from "@/pages/home";
import { HomeLayout } from "@/pages/home/ui/HomeLayout.tsx";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "authentication",
        element: <AuthenticationPage />,
      },
      {
        element: <AdminLayout />,
        path: "admin/*",
        children: [
          {
            path: "*",
            element: <AdminPage />,
          },
        ],
      },
      {
        element: <HomeLayout />,
        path: "*",
        children: [
          {
            path: "*",
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);
