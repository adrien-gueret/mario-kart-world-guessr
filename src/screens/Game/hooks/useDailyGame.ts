import { useState, useCallback } from "react";

import fetchApi from "@/services/api";

import type { LocationBase, Coordinates } from "@/types/location";

type DailyGame = {
  photos: LocationBase[];
  todayDailyDate: string;
  nextDailyDate: string;
};

type DailyGamePlayState = {
  coordinates: Coordinates[];
};

function shouldFetchDailyGame(nextDailyDate?: string): boolean {
  if (!nextDailyDate) {
    return true;
  }

  const today = new Date();
  const nextDaily = new Date(nextDailyDate);
  return today >= nextDaily;
}

export default function useDailyGame() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyGame, setDailyGame] = useState<DailyGame | null>(null);
  const [dailyGameState, setDailyGameState] = useState<DailyGamePlayState>({
    coordinates: [],
  });

  const isEnd = dailyGame
    ? dailyGame.photos.length === dailyGameState.coordinates.length
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

  const getNextDailyPhoto = useCallback(async () => {
    if (isEnd) {
      return null;
    }

    const { photos } = shouldFetchDailyGame(dailyGame?.nextDailyDate)
      ? await fetchDailyGame()
      : (dailyGame as DailyGame);

    return photos[dailyGameState.coordinates.length] ?? null;
  }, [dailyGame, fetchDailyGame, isEnd, dailyGameState]);

  const addGuess = useCallback(
    (coordinates: Coordinates) => {
      setDailyGameState((prevState) => ({
        ...prevState,
        coordinates: [...prevState.coordinates, coordinates],
      }));
    },
    [setDailyGameState]
  );

  return {
    addGuess,
    getNextDailyPhoto,
    isLoading,
    isEnd,
    maxPhotos: dailyGame?.photos.length ?? 0,
  };
}
