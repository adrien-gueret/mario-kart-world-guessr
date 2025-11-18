import type { ReactNode } from "react";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { AchievementsProvider } from "./achievements/AchievementsProvider.tsx";
import { CurrentUserProvider } from "./auth/CurrentUserProvider";
import { NotificationsProvider } from "./notifications/NotificationsProvider";
import { TranslationsProvider } from "./i18n";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationsProvider>
      <GoogleOAuthProvider clientId="1063543539522-m89mibo9kp0esu299c8jgj2bali17ltl.apps.googleusercontent.com">
        <CurrentUserProvider>
          <AchievementsProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </AchievementsProvider>
        </CurrentUserProvider>
      </GoogleOAuthProvider>
    </TranslationsProvider>
  );
}
