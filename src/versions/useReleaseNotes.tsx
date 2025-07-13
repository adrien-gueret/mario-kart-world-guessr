import { useEffect } from "react";

import { getKey, storeKey, removeKey } from "@/services/store";
import { useTranslations } from "@/i18n";

import allReleaseNotes from "./allReleaseNotes";

import currentVersion from "./currentVersion";

export default function useReleaseNotes() {
  const { currentLocale } = useTranslations();
  const lastSeenVersion = getKey("lastSeenVersion");

  // TODO: remove on next version
  const hasUsedOldVersionOfGame = Boolean(getKey("daily"));

  const indexOfLastSeenVersion = allReleaseNotes.findIndex(
    (releaseNote) => releaseNote.version === lastSeenVersion
  );

  console.log({
    hasUsedOldVersionOfGame,
    lastSeenVersion,
    indexOfLastSeenVersion,
  });

  const shouldShowReleaseNotes =
    hasUsedOldVersionOfGame ||
    (lastSeenVersion && indexOfLastSeenVersion !== 0);

  useEffect(() => {
    if (shouldShowReleaseNotes) {
      removeKey("daily");
      storeKey("lastSeenVersion", currentVersion);
    }
  }, [shouldShowReleaseNotes]);

  return shouldShowReleaseNotes
    ? allReleaseNotes[0].notes[currentLocale]
    : null;
}
