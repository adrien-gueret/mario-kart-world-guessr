import { useState } from "react";

import Map from "../Map";
import Pin from "../Pin";
import type { Photo as PhotoType } from "@/types/photos";

type Props = {
  photos: PhotoType[];
};

export default function PhotosMap({ photos }: Props) {
  const [zoomLevel, setZoomLevel] = useState(0);

  const imageScaling = [1, 2, 3, 4];

  return (
    <div className="photo-details">
      <div
        style={{
          position: "relative",
          textAlign: "center",
          width: "100%",
          // @ts-ignore
          "--image-scale": imageScaling[zoomLevel + 1] || 1,
        }}
      >
        <Map shouldZoomOnDoubleClick onZoomChange={setZoomLevel}>
          {photos.map((photo) => (
            <Pin
              key={photo.id}
              x={photo.x}
              y={photo.y}
              onlyHead
              variant="image"
              imageUrl={`${photo.photoUrl}?tr=h-80`}
            />
          ))}
        </Map>
      </div>
    </div>
  );
}
