import type { MouseEvent } from "react";

import type { LocationBase } from "../../data/locations";
import { getCoordinatesFromImage } from "../../services/coordinatesTransformer";

import "./Map.css";
import mapImageUrl from "./map.png";

type Props = {
  onClick: (coordinates: {
    realCoordinates: LocationBase["coordinates"];
    renderedCoordinates: { x: number; y: number };
  }) => void;
  ref: React.Ref<HTMLImageElement>;
};

export default function Map({ onClick, ref }: Props) {
  const handleMapClick = (event: MouseEvent<HTMLImageElement>) => {
    const coordinates = getCoordinatesFromImage(event.currentTarget, {
      x: event.clientX,
      y: event.clientY,
    });

    onClick(coordinates);
  };
  return (
    <img
      ref={ref}
      draggable={false}
      className="game-map"
      src={mapImageUrl}
      alt="Game Map"
      onClick={handleMapClick}
    />
  );
}
