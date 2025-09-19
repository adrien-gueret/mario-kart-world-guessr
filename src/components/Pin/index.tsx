import { useContext } from "react";

import { MapContext } from "@/components/Map";
import type { Coordinates } from "@/types/location";
import type { MarioCharacter } from "@/types/characters";

import "./Pin.css";

type Props = Coordinates & {
  variant?: MarioCharacter | "star" | null;
  onlyHead?: boolean;
  zIndex?: number;
};

const FULL_PIN_SIZE = 64;
const ONLY_HEAD_PIN_SIZE = 36;

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
  variant,
  onlyHead = false,
  zIndex,
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
      className={`game-map-pin variant-${variant ?? "mario"} ${
        onlyHead ? "only-head" : ""
      }`}
      style={{
        left: `${domX}px`,
        top: `${domY}px`,
        zIndex: zIndex || Math.max(1, domY),
      }}
    >
      {variant && <img src={`./ui/pins/icon-${variant}.png`} alt="" />}
    </div>
  );
}
