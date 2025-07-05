import type { Difficulty } from "@/types/game";

export const MAP_SIZE_IN_PIXELS = {
  width: 1431,
  height: 1303,
};

export const MAP_SIZE_IN_KM = {
  width: 10,
  height: 9,
};

const DIST_MAX = Math.sqrt(
  MAP_SIZE_IN_KM.width ** 2 + MAP_SIZE_IN_KM.height ** 2
);

type Coordinates = {
  x: number;
  y: number;
};

export function getCoordinatesFromImage(
  imageElement: HTMLImageElement,
  clickedCordinates: Coordinates
): {
  renderedCoordinates: Coordinates;
  realCoordinates: Coordinates;
} {
  const rect = imageElement.getBoundingClientRect();

  const ratio = imageElement.naturalWidth / imageElement.width;

  const x = Math.floor(clickedCordinates.x - rect.left);
  const y = Math.floor(clickedCordinates.y - rect.top);

  return {
    renderedCoordinates: { x, y },
    realCoordinates: {
      x: Math.round(x * ratio),
      y: Math.round(y * ratio),
    },
  };
}

export function getRenderedCoordinatesFromRealCoordinates(
  imageElement: HTMLImageElement,
  realCoordinates: Coordinates
): Coordinates {
  const ratio = imageElement.naturalWidth / imageElement.width;

  return {
    x: Math.round(realCoordinates.x / ratio),
    y: Math.round(realCoordinates.y / ratio),
  };
}

export function distanceBetweenCoordinatesInKilometers(
  pointA: Coordinates,
  pointB: Coordinates
): number {
  const deltaXPixels = pointB.x - pointA.x;
  const deltaYPixels = pointB.y - pointA.y;

  const distanceInPixels = Math.sqrt(
    deltaXPixels * deltaXPixels + deltaYPixels * deltaYPixels
  );

  const kmPerPixelX = MAP_SIZE_IN_KM.width / MAP_SIZE_IN_PIXELS.width;
  const kmPerPixelY = MAP_SIZE_IN_KM.height / MAP_SIZE_IN_PIXELS.height;

  const averageKmPerPixel = (kmPerPixelX + kmPerPixelY) / 2;

  const distanceInKm = distanceInPixels * averageKmPerPixel;

  return distanceInKm;
}

const SCORE_MAX = 5000;

export function getScoreFromDistanceInKilometers(
  distanceInKm: number,
  difficulty: Difficulty
): number {
  const distanceInMeters = distanceInKm * 1000;

  const difficultyToToleranceForMaxScore: Record<Difficulty, number> = {
    "50cc": 80,
    "100cc": 70,
    "150cc": 60,
    mirror: 60,
  };

  if (distanceInMeters <= difficultyToToleranceForMaxScore[difficulty]) {
    return SCORE_MAX;
  }

  const difficultyToThreshold: Record<Difficulty, number> = {
    "50cc": 6,
    "100cc": 8,
    "150cc": 10,
    mirror: 10,
  };

  const threshold = difficultyToThreshold[difficulty];
  return Math.ceil(5000 * Math.exp((-threshold * distanceInKm) / DIST_MAX));
}

export function getDistanceAndScoreFromCoordinates(
  pointA: Coordinates,
  pointB: Coordinates,
  difficulty: Difficulty = "150cc"
): {
  distance: number;
  score: number;
} {
  const distance = distanceBetweenCoordinatesInKilometers(pointA, pointB);
  const score = getScoreFromDistanceInKilometers(distance, difficulty);

  return { distance, score };
}
