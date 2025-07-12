import type { Coordinates } from "./location";

export type GameMode = "survival" | "goal" | "daily";

export type GameHistory = number[];

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
    isNewRecord: boolean | null;
    unlockedDifficulty: Difficulty | null;
    history: GameHistory;
    nextPhotoId: string | null;
  };
};

export type StartGameResponse = {
  id: number;
  history: GameHistory;
  totalScore: number;
  currentPhotoId: string | null;
};

type LeaderboardRank = {
  playerId: number;
  playerName: string;
  score: number;
  photoCount?: number;
  rank: number;
};

export type RelativeLeaderbordsResponse = LeaderboardRank[];

export type Cup = "none" | "bronze" | "silver" | "gold";

export type StarRank = "rank-0" | "rank-1" | "rank-2" | "rank-3";
