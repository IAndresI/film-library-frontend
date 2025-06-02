import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";

import { ThemeProvider } from "@/shared/ui/layout/ThemeProvider.tsx";
import { router } from "./router.tsx";

import { queryClient } from "@/shared/api/query-client.ts";

import "./index.css";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing clerck publishable key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          afterSignOutUrl="/"
        >
          <RouterProvider router={router} />
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
