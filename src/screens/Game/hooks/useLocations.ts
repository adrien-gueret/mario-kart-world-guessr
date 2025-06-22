import { useState, useCallback, useRef } from "react";

import fetchApi from "@/services/api";

import type { GameMode } from "@/types/game";
import type { LocationBase } from "@/types/location";

import useDailyGame from "./useDailyGame";

export default function useLocations(mode: GameMode) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<LocationBase | null>(
    null
  );
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);

  const {
    getNextDailyPhoto,
    isLoading: isDailyGameLoading,
    addGuess: addDailyGuess,
    hasReachedLimitPhotos,
    maxPhotos: dailyGameMaxPhotos,
  } = useDailyGame();

  const getNextPhoto = useCallback(async (): Promise<LocationBase | null> => {
    setIsLoading(true);

    let nextLocation: LocationBase | null = null;

    if (mode === "daily") {
      nextLocation = await getNextDailyPhoto();
    } else {
      const response = await fetchApi("/get-random-photo");

      if (!response.ok) {
        throw new Error("Failed to fetch random location");
      }

      nextLocation = (await response.json()) as LocationBase;
    }

    setCurrentLocation(nextLocation);
    setCurrentLocationIndex((prevIndex) => prevIndex + 1);
    setIsLoading(false);

    return nextLocation;
  }, [mode, getNextDailyPhoto]);

  return {
    addDailyGuess,
    isLocationLoading: isLoading || isDailyGameLoading,
    getNextPhoto,
    currentLocation,
    currentLocationIndex,
    maxPhotos: mode === "daily" ? dailyGameMaxPhotos : 0,
    hasReachedLimitPhotos,
  };
}
