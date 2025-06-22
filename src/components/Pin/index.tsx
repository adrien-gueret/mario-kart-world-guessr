import type { Coordinates } from "@/types/location";

import "./Pin.css";

type Props = Coordinates & {
  variant?: "mario" | "star";
};

export default function Pin({ x, y, variant = "mario" }: Props) {
  return (
    <div
      key={`${x}-${y}`}
      className={`game-map-pin variant-${variant}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <img src={`./ui/icon-${variant}.webp`} alt="" />
    </div>
  );
}
