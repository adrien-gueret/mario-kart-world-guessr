import type { Coordinates } from "./location";

import type { MarioCharacter } from "./characters";

export type GameMode = "survival" | "goal" | "daily";

export type GameHistory = number[];

export type Difficulty = "50cc" | "100cc" | "150cc" | "mirror";

export type Cup = "none" | "bronze" | "silver" | "gold";

export type StarRank = "rank-0" | "rank-1" | "rank-2" | "rank-3";

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
    cupData: {
      cup: Cup;
      starRank?: StarRank | null;
    } | null;
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
  marioCharacter: MarioCharacter | null;
  score: number;
  photoCount?: number;
  rank: number;
  isAnonymous: 1 | 0;
};

export type LeaderboardsResponse = LeaderboardRank[];
