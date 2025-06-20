import type { MouseEvent } from "react";

import type { Coordinates } from "@/locations/LocationsProvider";
import { getCoordinatesFromImage } from "../../services/coordinatesTransformer";

import "./Map.css";
import mapImageUrl from "./map.png";
import mapWithCoursesImageUrl from "./map_with_courses.png";

type Props = {
  onClick: (coordinates: {
    realCoordinates: Coordinates;
    renderedCoordinates: { x: number; y: number };
  }) => void;
  ref?: React.Ref<HTMLImageElement>;
  withCourses?: boolean;
};

export default function Map({
  onClick,
  ref = null,
  withCourses = false,
}: Props) {
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
      src={withCourses ? mapWithCoursesImageUrl : mapImageUrl}
      alt="Game Map"
      onClick={handleMapClick}
    />
  );
}
