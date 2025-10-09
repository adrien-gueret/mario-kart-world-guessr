import { Marker } from "react-leaflet";
import L from "leaflet";

import { MAP_SIZE_IN_PIXELS } from "@/services/coordinates";

import type { Coordinates } from "@/types/location";
import type { MarioCharacter } from "@/types/characters";

import "./Pin.css";

type Props = Coordinates & {
  variant?: MarioCharacter | "star" | null;
  onlyHead?: boolean;
  zIndex?: number;
  onDragEnd?: (newCoordinates: Coordinates) => void;
};

export default function Pin({
  x,
  y,
  variant,
  onlyHead = false,
  zIndex,
  onDragEnd,
}: Props) {
  const pin = L.divIcon({
    html: `<div
        class="game-map-pin variant-${variant ?? "mario"} ${
      onlyHead ? "only-head" : ""
    }"
      >
        ${variant ? `<img src="./ui/pins/icon-${variant}.png" alt="" />` : ""}
      </div>`,
    className: "",
    iconSize: onlyHead ? [36, 36] : [64, 64],
    iconAnchor: onlyHead ? [18, 18] : [32, 64],
  });

  const draggable = Boolean(onDragEnd);

  return (
    <Marker
      position={[MAP_SIZE_IN_PIXELS.height - y, x]}
      icon={pin}
      zIndexOffset={zIndex}
      interactive={draggable}
      draggable={draggable}
      eventHandlers={
        draggable
          ? {
              dragend: (event) => {
                const marker = event.target;
                const position = marker.getLatLng();
                onDragEnd!({
                  x: Math.floor(position.lng),
                  y: Math.floor(MAP_SIZE_IN_PIXELS.height - position.lat),
                });
              },
            }
          : undefined
      }
    />
  );
}
