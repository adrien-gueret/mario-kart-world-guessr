import { useEffect, useRef } from "react";

import { getKey, storeKey, removeKey } from "@/services/store";
import { useTranslations } from "@/i18n";

import allReleaseNotes from "./allReleaseNotes";

import currentVersion from "./currentVersion";

export default function useReleaseNotes() {
  const { currentLocale } = useTranslations();
  const lastSeenVersion = useRef(getKey("lastSeenVersion")).current;

  const indexOfLastSeenVersion = allReleaseNotes.findIndex(
    (releaseNote) => releaseNote.version === lastSeenVersion
  );

  const shouldShowReleaseNotes =
    lastSeenVersion && indexOfLastSeenVersion !== 0;

  useEffect(() => {
    if (shouldShowReleaseNotes) {
      removeKey("daily");
      storeKey("lastSeenVersion", currentVersion.version);
    }
  }, [shouldShowReleaseNotes]);

  return shouldShowReleaseNotes ? currentVersion.notes[currentLocale] : null;
}
