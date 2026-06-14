import type { Coordinates } from "./location";

import type { UsableMarioCharacter } from "@/characters";

import type { IsoDate } from "@/services/daily";

export type GameMode = "survival" | "goal" | "chrono" | "daily";

export type GameHistory = number[];

export type Difficulty = "50cc" | "100cc" | "150cc" | "mirror";

export type Cup = "none" | "bronze" | "silver" | "gold";

export type StarRank = "rank-0" | "rank-1" | "rank-2" | "rank-3";

type GamePhoto = {
  id: string;
  author: {
    id: number;
    name: string;
    character: UsableMarioCharacter | null;
  };
};

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
    minimumScoreToContinue: number | null;
    remainingTime?: number | null;
    nextPhoto: GamePhoto | null;
  };
};

export type StartGameResponse = {
  id: number;
  history: GameHistory;
  totalScore: number;
  currentPhoto: GamePhoto | null;
  minimumScoreToContinue: number | null;
  remainingTime?: number | null;
};

type LeaderboardRank = {
  playerId: number;
  playerName: string;
  marioCharacter: UsableMarioCharacter | null;
  score: number;
  photoCount?: number;
  rank: number;
  isAnonymous: 1 | 0;
};

export type LeaderboardsResponse = LeaderboardRank[];

export type DailiesResponse = Array<{
  id: number;
  dailyDate: IsoDate;
}>;
