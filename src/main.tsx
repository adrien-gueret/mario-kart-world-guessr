import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AchievementsProvider } from "./achievements/AchievementsProvider.tsx";
import { NotificationsProvider } from "./notifications/NotificationsProvider";
import { TranslationsProvider } from "./i18n";
import { SnackbarsProvider } from "./snackbars/SnackbarsProvider";

import "./index.css";
import Router from "./Router.tsx";

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
    <TranslationsProvider>
      <GoogleOAuthProvider clientId="1063543539522-m89mibo9kp0esu299c8jgj2bali17ltl.apps.googleusercontent.com">
        <AchievementsProvider>
          <NotificationsProvider>
            <SnackbarsProvider>
              <Router />
            </SnackbarsProvider>
          </NotificationsProvider>
        </AchievementsProvider>
      </GoogleOAuthProvider>
    </TranslationsProvider>
  </StrictMode>
);
