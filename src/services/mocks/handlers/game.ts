import type {
  AddGuessResponse,
  Cup,
  Difficulty,
  GameMode,
  StartGameResponse,
  StarRank,
} from "@/types/game";
import type { Achievement } from "@/types/achievements";

import { db, type GameState } from "../db";
import { field, jsonResponse, notFound } from "../helpers";
import type { MockHandlers } from "../types";

const ROUNDS = 5;
const CHRONO_TIME_MS = 120_000;
const SURVIVAL_MINIMUM = 3000;

function gamePhoto(photoId: string): StartGameResponse["currentPhoto"] {
  return {
    id: photoId,
    author: { id: 7, name: "Toadstool", character: "peach" },
  };
}

function computeCup(totalScore: number): {
  cup: Cup;
  starRank: StarRank | null;
} {
  if (totalScore >= 20000) {
    const stars: StarRank =
      totalScore >= 24000
        ? "rank-3"
        : totalScore >= 22000
          ? "rank-2"
          : "rank-1";
    return { cup: "gold", starRank: stars };
  }
  if (totalScore >= 15000) return { cup: "silver", starRank: null };
  if (totalScore >= 10000) return { cup: "bronze", starRank: null };
  return { cup: "none", starRank: null };
}

const gameHandlers: MockHandlers = {
  "POST /start-game": ({ body }) => {
    const mode = (field(body, "mode") ?? "goal") as GameMode;
    const difficulty = field(body, "difficulty") as Difficulty | undefined;

    const id = db.counters.game++;
    const photoIds = db.photos
      .filter((photo) => photo.validatedAt)
      .slice(0, ROUNDS)
      .map((photo) => photo.id);

    const remainingTime = mode === "chrono" ? CHRONO_TIME_MS : null;

    const game: GameState = {
      id,
      mode,
      difficulty: difficulty ?? null,
      photoIds,
      index: 0,
      history: [],
      totalScore: 0,
      remainingTime,
      finished: false,
    };
    db.games.set(id, game);

    const response: StartGameResponse = {
      id,
      history: [],
      totalScore: 0,
      currentPhoto: photoIds.length ? gamePhoto(photoIds[0]) : null,
      minimumScoreToContinue: mode === "survival" ? SURVIVAL_MINIMUM : null,
      remainingTime,
    };

    return jsonResponse(response);
  },

  "POST /add-guess": ({ body }) => {
    const gameId = Number(field(body, "gameId"));
    const game = db.games.get(gameId);
    if (!game) return notFound(`game ${gameId}`);

    const photoId = field(body, "photoId");
    const guessX = Number(field(body, "x") ?? 0);
    const guessY = Number(field(body, "y") ?? 0);

    const photo = db.photos.find((p) => p.id === photoId);
    const actualCoordinates = { x: photo?.x ?? 0, y: photo?.y ?? 0 };

    const pixelDistance = Math.hypot(
      actualCoordinates.x - guessX,
      actualCoordinates.y - guessY,
    );
    const distanceInKm = Math.round(pixelDistance / 10);
    const newScore = Math.max(0, 5000 - Math.round(pixelDistance));

    game.history.push(newScore);
    game.totalScore += newScore;
    game.index += 1;

    const survivedRound =
      game.mode !== "survival" || newScore >= SURVIVAL_MINIMUM;
    const hasNext = game.index < game.photoIds.length && survivedRound;
    const nextPhoto = hasNext ? gamePhoto(game.photoIds[game.index]) : null;
    const isFinished = !nextPhoto;
    if (isFinished) game.finished = true;

    const cupData = isFinished ? computeCup(game.totalScore) : null;

    const response: AddGuessResponse = {
      actualCoordinates,
      playersMedianCoordinates: {
        x: actualCoordinates.x + 40,
        y: actualCoordinates.y - 30,
      },
      playersGuessCount: 128,
      currentPlayerGuess: { distanceInKm, newScore },
      gameData: {
        totalScore: game.totalScore,
        isFinished,
        cupData,
        history: game.history,
        minimumScoreToContinue:
          game.mode === "survival" ? SURVIVAL_MINIMUM : null,
        remainingTime: game.mode === "chrono" ? game.remainingTime : null,
        nextPhoto,
      },
    };

    // Demonstrate the achievement-unlock header wiring on a gold goal run.
    const achievements: Achievement[] | undefined =
      isFinished && cupData?.cup === "gold" && game.mode === "goal"
        ? [`gold_${game.difficulty ?? "50cc"}_goal` as Achievement]
        : undefined;

    return jsonResponse(response, { achievements });
  },

  "PUT /give-up": ({ body }) => {
    const gameId = Number(field(body, "gameId"));
    const game = db.games.get(gameId);
    if (game) game.finished = true;

    const cupData = game ? computeCup(game.totalScore) : null;
    return jsonResponse({ cupData });
  },

  "GET /cups": () =>
    jsonResponse({
      "50cc": { cup: "gold", starRank: "rank-3" },
      "100cc": { cup: "silver" },
      "150cc": { cup: "gold", starRank: "rank-1" },
      mirror: { cup: "bronze" },
    }),
};

export default gameHandlers;
