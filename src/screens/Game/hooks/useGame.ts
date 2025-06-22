import { useState, useCallback } from "react";

import fetchApi from "@/services/api";

import type { GameMode, GameHistory } from "@/types/game";
import type { LocationBase } from "@/types/location";

import useDailyGame from "./useDailyGame";

export default function useGame(mode: GameMode) {
  const [gameHistory, setGameHistory] = useState<GameHistory>({
    scores: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<LocationBase | null>(
    null
  );
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);

  const addScoreInHistory = useCallback((score: number) => {
    setGameHistory((prevState) => ({
      ...prevState,
      scores: [...prevState.scores, score],
    }));
  }, []);

  const {
    getNextDailyLocation,
    isLoading: isDailyGameLoading,
    hasReachedLimit,
    maxLocations: dailyGameMaxLocations,
  } = useDailyGame(gameHistory);

  const getNextLocation =
    useCallback(async (): Promise<LocationBase | null> => {
      setIsLoading(true);

      let nextLocation: LocationBase | null = null;

      if (mode === "daily") {
        nextLocation = await getNextDailyLocation();
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
    }, [mode, getNextDailyLocation]);

  return {
    addScoreInHistory,
    gameHistory,
    isLocationLoading: isLoading || isDailyGameLoading,
    getNextLocation,
    currentLocation,
    currentLocationIndex,
    maxLocations: mode === "daily" ? dailyGameMaxLocations : 0,
    hasReachedLimit,
  };
}
