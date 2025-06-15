import type { MouseEvent } from "react";

import type { LocationBase } from "../../data/locations";

import "./Map.css";
import mapImageUrl from "./map.png";

type Props = {
  onClick: (coordinates: LocationBase["coordinates"]) => void;
};

export default function Map({ onClick }: Props) {
  const handleMapClick = (event: MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);

    onClick({ x, y });
  };
  return (
    <img
      draggable={false}
      className="game-map"
      src={mapImageUrl}
      alt="Game Map"
      onClick={handleMapClick}
    />
  );
}
