import { useState, useCallback } from "react";

import fetchApi from "@/services/api";
import { isDateInThePast, shouldRunNewDailyGame } from "@/services/daily";

import type { GameHistory } from "@/types/game";
import type { LocationBase } from "@/types/location";
import { storeKey } from "@/services/store";

type DailyGame = {
  photos: LocationBase[];
  todayDailyDate: string;
  nextDailyDate: string;
};

function shouldFetchDailyGame(nextDailyDate?: string): boolean {
  if (!nextDailyDate) {
    return true;
  }

  return isDateInThePast(nextDailyDate);
}

export default function useDailyGame(history: GameHistory) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyGame, setDailyGame] = useState<DailyGame | null>(null);

  const hasReachedLimit = dailyGame
    ? dailyGame.photos.length === history.scores.length
    : false;

  const fetchDailyGame = useCallback(async () => {
    setIsLoading(true);

    const response = await fetchApi(`/daily-photos?v=${String(Date.now())}`);

    if (!response.ok) {
      throw new Error("Failed to fetch daily game");
    }

    const data = (await response.json()) as DailyGame;

    setDailyGame(data);
    setIsLoading(false);

    return data;
  }, []);

  const getNextDailyLocation = useCallback(async () => {
    if (hasReachedLimit) {
      return null;
    }

    let photos: LocationBase[] = [];

    if (shouldFetchDailyGame(dailyGame?.nextDailyDate)) {
      const response = await fetchDailyGame();
      photos = response.photos;

      if (shouldRunNewDailyGame()) {
        storeKey("daily", {
          history: {
            scores: [],
          },
          nextDailyDate: response.nextDailyDate,
        });
      }
    } else {
      photos = dailyGame?.photos || [];
    }

    return photos[history.scores.length] ?? null;
  }, [dailyGame, fetchDailyGame, hasReachedLimit, history]);

  return {
    getNextDailyLocation,
    isLoading,
    hasReachedLimit,
    maxLocations: dailyGame?.photos.length ?? 0,
    nextDailyDate: dailyGame?.nextDailyDate ?? null,
  };
}
