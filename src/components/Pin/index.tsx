import { useContext } from "react";

import { MapContext } from "@/components/Map";
import type { Coordinates } from "@/types/location";

import "./Pin.css";

type Props = Coordinates & {
  variant?: "mario" | "luigi" | "star";
  onlyHead?: boolean;
};

const FULL_PIN_SIZE = 64;
const ONLY_HEAD_PIN_SIZE = 40;

function targetCoordinatesToFullPinDomCoordinates(coordinates: Coordinates) {
  return {
    x: coordinates.x - FULL_PIN_SIZE / 2,
    y: coordinates.y - FULL_PIN_SIZE,
  };
}

function targetCoordinatesToOnlyHeadPinDomCoordinates(
  coordinates: Coordinates
) {
  return {
    x: coordinates.x - ONLY_HEAD_PIN_SIZE / 2,
    y: coordinates.y - ONLY_HEAD_PIN_SIZE / 2,
  };
}

export default function Pin({
  x,
  y,
  variant = "mario",
  onlyHead = false,
}: Props) {
  const { ratio } = useContext(MapContext);
  const { x: domX, y: domY } = onlyHead
    ? targetCoordinatesToOnlyHeadPinDomCoordinates({
        x: x / ratio,
        y: y / ratio,
      })
    : targetCoordinatesToFullPinDomCoordinates({
        x: x / ratio,
        y: y / ratio,
      });

  return (
    <div
      key={`${domX}-${domY}`}
      className={`game-map-pin variant-${variant} ${
        onlyHead ? "only-head" : ""
      }`}
      style={{
        left: `${domX}px`,
        top: `${domY}px`,
        zIndex: domY,
      }}
    >
      <img src={`./ui/icon-${variant}.png`} alt="" />
    </div>
  );
}
