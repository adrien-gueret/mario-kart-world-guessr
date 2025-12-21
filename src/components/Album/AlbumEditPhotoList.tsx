import { flushSync } from "react-dom";
import { useHits } from "react-instantsearch";

import { getCDNPhotoUrl } from "@/services/images";
import type { Photo } from "@/types/photos";

import ValidIcon from "../Icon/Valid";

type HitPhoto = Pick<Photo, "id" | "photoUrl">;

type Props = {
  isPhotoSelected: (photoId: string) => boolean;
  onPhotoSelected: (photo: HitPhoto) => void;
};

export default function AlbumEditPhotoList({
  isPhotoSelected,
  onPhotoSelected,
}: Props) {
  const { items: availablePhotos } = useHits<HitPhoto>();

  return (
    <ul className="album-photos">
      {availablePhotos.map((photo) => {
        const isSelected = isPhotoSelected(photo.id);
        return (
          <li
            key={photo.id}
            className={`album-item album-photo ${isSelected ? "selected" : ""}`}
          >
            <button
              type="button"
              className="album-select-photo-button"
              disabled={isSelected}
              tabIndex={isSelected ? -1 : 0}
              onClick={(e) => {
                const img = e.currentTarget.querySelector("img");

                if (img) {
                  img.style.viewTransitionName = `album-photo-${photo.id}`;
                }

                document.startViewTransition(() => {
                  flushSync(() => {
                    onPhotoSelected(photo);

                    if (img) {
                      img.style.viewTransitionName = "";
                    }
                  });
                });
              }}
            >
              <img
                src={getCDNPhotoUrl(photo.photoUrl, { h: 225 })}
                alt=""
                loading="lazy"
              />
            </button>
            {isSelected && (
              <span className="album-photo-selected-badge">
                <ValidIcon width="48px" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
