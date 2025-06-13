import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { queryClient } from '@/shared/api/query-client.ts';
import { ThemeProvider } from '@/shared/ui/layout/ThemeProvider.tsx';

import { router } from './router.tsx';

import './index.css';

import { Toaster } from '@/shared/ui/sonner.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="system"
        storageKey="vite-ui-theme"
      >
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
