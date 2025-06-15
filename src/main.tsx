import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { TranslationsProvider } from "./i18n";
import { ScreensProvider } from "./screens";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScreensProvider>
      <TranslationsProvider>
        <App />
      </TranslationsProvider>
    </ScreensProvider>
  </StrictMode>
);
