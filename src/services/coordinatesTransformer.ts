export const PIN_SIZE = 64;

export const MAP_SIZE_IN_PIXELS = {
  width: 1430,
  height: 1300,
};

export const MAP_SIZE_IN_KM = {
  width: 10,
  height: 9,
};

type Coordinates = {
  x: number;
  y: number;
};

export function bottomCenterTopTopLeft(coordinates: Coordinates) {
  return {
    x: coordinates.x - PIN_SIZE / 2,
    y: coordinates.y - PIN_SIZE,
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
