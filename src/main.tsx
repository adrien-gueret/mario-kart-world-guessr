import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { AchievementsProvider } from "./achievements/AchievementsProvider.tsx";
import { CurrentUserProvider } from "./auth/CurrentUserProvider";
import { TranslationsProvider } from "./i18n";
import { ScreensProvider } from "./screens";
import "./index.css";
import App from "./App.tsx";

if (!document.startViewTransition) {
  // @ts-ignore
  document.startViewTransition = (callback) => {
    // @ts-ignore
    callback();

    return {
      finished: Promise.resolve(),
    };
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScreensProvider>
      <TranslationsProvider>
        <GoogleOAuthProvider clientId="1063543539522-m89mibo9kp0esu299c8jgj2bali17ltl.apps.googleusercontent.com">
          <CurrentUserProvider>
            <AchievementsProvider>
              <App />
            </AchievementsProvider>
          </CurrentUserProvider>
        </GoogleOAuthProvider>
      </TranslationsProvider>
    </ScreensProvider>
  </StrictMode>
);
