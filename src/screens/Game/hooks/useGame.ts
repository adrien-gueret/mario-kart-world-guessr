import { useState, useCallback } from "react";

import fetchApi from "@/services/api";

import type {
  GameMode,
  GameHistory,
  Difficulty,
  StartGameResponse,
} from "@/types/game";
import type { LocationBase } from "@/types/location";

import { shouldRunNewDailyGame } from "@/services/daily";
import { getKey, storeKey } from "@/services/store";

import useDailyGame from "./useDailyGame";
import { useCurrentUser } from "@/auth/CurrentUserProvider";

export default function useGame(mode: GameMode, difficulty?: Difficulty) {
  const { user } = useCurrentUser();

  const [currentGameId, setCurrentGameId] = useState<number | null>(null);

  const [gameHistory, setGameHistory] = useState<GameHistory>(() => {
    if (mode !== "daily" || shouldRunNewDailyGame()) {
      return { scores: [] };
    }

    const storedDaily = getKey("daily");
    return storedDaily?.history || { scores: [] };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<LocationBase | null>(
    null
  );
  const currentLocationIndex = gameHistory.scores.length + 1;

  const addScoreInHistory = useCallback(
    (score: number) => {
      setGameHistory((prevState) => {
        const newHistory = {
          ...prevState,
          scores: [...prevState.scores, score],
        };

        if (mode === "daily") {
          const storedDaily = getKey("daily");

          storeKey("daily", {
            ...storedDaily,
            history: newHistory,
          });
        }

        return newHistory;
      });
    },
    [mode]
  );

  const {
    getNextDailyLocation,
    isLoading: isDailyGameLoading,
    hasReachedLimit,
    maxLocations: dailyGameMaxLocations,
    nextDailyDate,
  } = useDailyGame(gameHistory);

  const getNextLocation = useCallback(
    async (isFirstLocation: boolean): Promise<LocationBase | null> => {
      setIsLoading(true);

      let nextLocation: LocationBase | null = null;

      if (isFirstLocation) {
        const formData = new FormData();

        formData.append("mode", mode);

        if (difficulty) {
          formData.append("difficulty", difficulty);
        }

        const response = await fetchApi(`/start-game`, "POST", formData);

        const game = (await response.json()) as StartGameResponse;

        setCurrentGameId(game.id);

        setGameHistory({
          scores: game.history || [],
        });
      }

      if (mode === "daily") {
        nextLocation = await getNextDailyLocation();
      } else {
        const response = await fetchApi(
          `/get-random-photo?difficulty=${difficulty}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch random location");
        }

        nextLocation = (await response.json()) as LocationBase;
      }

      setCurrentLocation(nextLocation);
      setIsLoading(false);

      return nextLocation;
    },
    [mode, difficulty, getNextDailyLocation, user]
  );

  return {
    currentGameId,
    addScoreInHistory,
    gameHistory,
    isLocationLoading: isLoading || isDailyGameLoading,
    getNextLocation,
    currentLocation,
    currentLocationIndex,
    maxLocations: mode === "daily" ? dailyGameMaxLocations : 0,
    hasReachedLimit,
    nextDailyDate,
  };
}
