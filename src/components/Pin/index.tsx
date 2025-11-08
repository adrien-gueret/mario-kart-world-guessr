import { Marker, type MarkerProps } from "react-leaflet";
import L from "leaflet";

import { MAP_SIZE_IN_PIXELS } from "@/services/coordinates";

import type { Coordinates } from "@/types/location";
import type { MarioCharacter } from "@/types/characters";

import "./Pin.css";

type BaseProps = Coordinates & {
  variant?: MarioCharacter | "star" | "image" | null;
  onlyHead?: boolean;
  imageUrl?: string;
  zIndex?: number;
  onDragEnd?: (newCoordinates: Coordinates) => void;
  onHover?: () => void;
  onClick?: () => void;
};

type WithPhotoProps = BaseProps & {
  variant: "image";
  imageUrl: string;
};

type WithoutPhotoProps = BaseProps & {
  variant?: Exclude<BaseProps["variant"], "image">;
  imageUrl?: never;
};

type Props = WithPhotoProps | WithoutPhotoProps;

export default function Pin({
  x,
  y,
  variant,
  imageUrl,
  onlyHead = false,
  zIndex,
  onDragEnd,
  onHover,
  onClick,
}: Props) {
  const pin = L.divIcon({
    html: `<div
        class="game-map-pin variant-${variant ?? "mario"} ${
      onlyHead ? "only-head" : ""
    }"
      >
      ${
        variant
          ? variant === "image"
            ? `<img src="${imageUrl}" alt="" />`
            : `<img src="./ui/pins/icon-${variant}.png" alt="" />`
          : ""
      }
      </div>`,
    className: "",
    iconSize: onlyHead ? [36, 36] : [64, 64],
    iconAnchor: onlyHead ? [18, 18] : [32, 64],
  });

  const draggable = Boolean(onDragEnd);
  const hoverable = Boolean(onHover);
  const clickable = Boolean(onClick);
  const isInteractive = draggable || hoverable || clickable;
  const eventHandlers: MarkerProps["eventHandlers"] = {};

  if (draggable) {
    eventHandlers.dragend = (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      onDragEnd!({
        x: Math.floor(position.lng),
        y: Math.floor(MAP_SIZE_IN_PIXELS.height - position.lat),
      });
    };
  }

  if (hoverable) {
    eventHandlers.mouseover = () => {
      onHover!();
    };
  }

  if (clickable) {
    eventHandlers.click = () => {
      onClick!();
    };
  }

  return (
    <Marker
      position={[MAP_SIZE_IN_PIXELS.height - y, x]}
      icon={pin}
      zIndexOffset={zIndex}
      interactive={isInteractive}
      draggable={draggable}
      eventHandlers={eventHandlers}
    />
  );
}
