import Map from "../Map";
import Pin from "../Pin";
import type { Photo } from "@/types/photos";

type Props = {
  photos: Photo[];
};
export default function PhotosMap({ photos }: Props) {
  return (
    <div className="photo-details">
      <div
        style={{
          position: "relative",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Map shouldZoomOnDoubleClick>
          {photos.map((photo) => (
            <Pin key={photo.id} x={photo.x} y={photo.y} />
          ))}
        </Map>
      </div>
    </div>
  );
}
