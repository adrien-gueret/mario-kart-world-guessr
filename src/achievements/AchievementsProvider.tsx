import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

import Snackbar from "@/components/Snackbar";

import { useTranslations } from "@/i18n";

import type { Achievement } from "@/types/achievements";

import getAchievementIcon from "./getAchievementIcon";

declare global {
  interface WindowEventMap {
    achievementUnlocked: CustomEvent<{ achievementId: Achievement }>;
  }
}

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [achievementsQueue, setAchievementsQueue] = useState<Achievement[]>([]);
  const [canShowSnackbar, setCanShowSnackbar] = useState(true);
  const achievementToShowRef = useRef<Achievement | undefined>(
    achievementsQueue[0]
  );

  const achievementToShow = achievementsQueue[0];
  achievementToShowRef.current =
    achievementToShow || achievementToShowRef.current;

  const { translate } = useTranslations();

  useEffect(() => {
    const onAchievementUnlocked = (
      event: CustomEvent<{ achievementId: Achievement }>
    ) => {
      setAchievementsQueue((prev) => [...prev, event.detail.achievementId]);
    };

    window.addEventListener("achievementUnlocked", onAchievementUnlocked);

    return () => {
      window.removeEventListener("achievementUnlocked", onAchievementUnlocked);
    };
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    if (!achievementToShow) {
      return;
    }

    setCanShowSnackbar(false);

    setTimeout(() => {
      setCanShowSnackbar(true);

      setAchievementsQueue((prev) =>
        prev.filter(
          (currentAchievement) => currentAchievement !== achievementToShow
        )
      );
    }, 500);
  }, [achievementToShow]);

  return (
    <>
      {children}
      <Snackbar
        icon={getAchievementIcon(achievementToShowRef.current!)}
        isOpen={canShowSnackbar && Boolean(achievementToShow)}
        onClose={handleCloseSnackbar}
        timeout={5000}
      >
        {translate(`${achievementToShowRef.current!}.unlockedItem`)}
        <br />
        <span style={{ fontSize: "1rem" }}>
          {translate(`${achievementToShowRef.current!}.description`)}
        </span>
      </Snackbar>
    </>
  );
}
