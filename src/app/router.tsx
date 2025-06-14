import { createBrowserRouter } from 'react-router-dom';

import { AdminPage } from '@/pages/admin';
import { AuthenticationPage } from '@/pages/authentication';
import { HomePage } from '@/pages/home';
import { HomeLayout } from '@/pages/home/ui/HomeLayout.tsx';
import { WatchFilmPage } from '@/pages/watchFilm/ui/WatchFilmPage.tsx';

import { AuthLayout } from '../features/auth/ui/AuthLayout.tsx';
import { AdminLayout } from '../pages/admin/ui/AdminLayout.tsx';

export const router = createBrowserRouter([
  {
    path: 'authentication',
    element: <AuthenticationPage />,
  },
  {
    path: '*',
    element: <AuthLayout />,
    children: [
      {
        path: 'film/:id/watch',
        element: <WatchFilmPage />,
      },
      {
        element: <AdminLayout />,
        path: 'admin/*',
        children: [
          {
            path: '*',
            element: <AdminPage />,
          },
        ],
      },
      {
        element: <HomeLayout />,
        path: '*',
        children: [
          {
            path: '*',
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);
