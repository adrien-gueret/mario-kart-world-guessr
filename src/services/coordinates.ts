export const MAP_SIZE_IN_PIXELS = {
  width: 1431,
  height: 1303,
};

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
