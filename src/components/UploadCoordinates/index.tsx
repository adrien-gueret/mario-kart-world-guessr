import { MAP_SIZE_IN_PIXELS } from "@/services/coordinates";

import type { Coordinates } from "@/types/location";

import "./UploadCoordinates.css";

type Props = {
  coordinates: Coordinates;
  onChange: (coordinates: Coordinates) => void;
};

export default function UploadCoordinates({ coordinates, onChange }: Props) {
  const { x, y } = coordinates;

  return (
    <div className="upload-coordinates">
      <div>
        <label>X:</label>

        <input
          type="number"
          min="0"
          max={MAP_SIZE_IN_PIXELS.width}
          value={x}
          onInput={(e) =>
            onChange({ ...coordinates, x: e.currentTarget.valueAsNumber })
          }
        />
      </div>
      <div>
        <label>Y:</label>

        <input
          type="number"
          min="0"
          max={MAP_SIZE_IN_PIXELS.height}
          value={y}
          onInput={(e) =>
            onChange({ ...coordinates, y: e.currentTarget.valueAsNumber })
          }
        />
      </div>
    </div>
  );
}
