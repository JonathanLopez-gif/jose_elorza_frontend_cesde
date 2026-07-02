import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { AppProviders } from "@/providers";
import { AppRouter } from "@/router";
import "@/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>
);