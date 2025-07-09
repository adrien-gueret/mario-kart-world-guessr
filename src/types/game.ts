import type { Coordinates } from "./location";

export type GameMode = "survival" | "goal" | "daily";

export type GameHistory = {
  scores: number[];
};

export type Difficulty = "50cc" | "100cc" | "150cc" | "mirror";

export type AddGuessResponse = {
  actualCoordinates: Coordinates;
  playersMedianCoordinates: Coordinates;
  playersGuessCount: number;
  currentPlayerGuess: {
    distanceInKm: number;
    newScore: number;
  };
  gameData: {
    totalScore: number;
    isFinished: boolean;
  };
};

export type StartGameResponse = {
  id: number;
  history: GameHistory["scores"];
};
