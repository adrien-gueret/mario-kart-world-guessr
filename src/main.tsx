import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { GoogleUserProvider } from "./auth/GoogleUserProvider";
import { LocationsProvider } from "./locations/LocationsProvider";
import { TranslationsProvider } from "./i18n";
import { ScreensProvider } from "./screens";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScreensProvider>
      <TranslationsProvider>
        <GoogleOAuthProvider clientId="1063543539522-m89mibo9kp0esu299c8jgj2bali17ltl.apps.googleusercontent.com">
          <GoogleUserProvider>
            <LocationsProvider>
              <App />
            </LocationsProvider>
          </GoogleUserProvider>
        </GoogleOAuthProvider>
      </TranslationsProvider>
    </ScreensProvider>
  </StrictMode>
);
