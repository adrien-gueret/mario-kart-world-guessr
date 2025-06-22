import { useState, useCallback } from "react";

import fetchApi from "@/services/api";

import type { GameHistory } from "@/types/game";
import type { LocationBase } from "@/types/location";

type DailyGame = {
  photos: LocationBase[];
  todayDailyDate: string;
  nextDailyDate: string;
};

function shouldFetchDailyGame(nextDailyDate?: string): boolean {
  if (!nextDailyDate) {
    return true;
  }

  const today = new Date();
  const nextDaily = new Date(nextDailyDate);
  return today >= nextDaily;
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

    const { photos } = shouldFetchDailyGame(dailyGame?.nextDailyDate)
      ? await fetchDailyGame()
      : (dailyGame as DailyGame);

    return photos[history.scores.length] ?? null;
  }, [dailyGame, fetchDailyGame, hasReachedLimit, history]);

  return {
    getNextDailyLocation,
    isLoading,
    hasReachedLimit,
    maxLocations: dailyGame?.photos.length ?? 0,
  };
}
