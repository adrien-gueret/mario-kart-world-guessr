import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createPortal, flushSync } from "react-dom";
import { useOutletContext } from "react-router-dom";

import getPositionedAlbumPhotos from "@/components/Album/getPositionedAlbumPhotos";
import type { AlbumOutletContext } from "@/layouts/sublayouts/AlbumLayout";
import { getCDNPhotoUrl } from "@/services/images";
import type { AlbumPhoto } from "@/types/photos";

import "@/components/Album/Album.css";

type MinimalPhoto = {
  id: string;
  photoUrl: string;
};

function getTransitionName(photoId: string) {
  return `album-photo-${photoId}`;
}

export default function AlbumPhotos() {
  const { album } = useOutletContext<AlbumOutletContext>();
  const { photos, backgroundColor, backgroundImage } = album;

  const [zoomedPhoto, setZoomedPhoto] = useState<MinimalPhoto | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<MinimalPhoto | null>(null);

  const albumPhotos = useMemo<
    Array<{
      position: number;
      photo: AlbumPhoto | undefined;
    }>
  >(() => getPositionedAlbumPhotos(photos), [photos]);

  const albumStyle: CSSProperties & Record<`--${string}`, string> = {
    ["--album-color"]: backgroundColor,
    ["--album-image"]: `url("./backgrounds/albums/${backgroundImage}.jpg")`,
  };

  function toggleZoomedPhoto(
    newPhoto: MinimalPhoto | null = null,
    callback?: () => void,
  ) {
    document.startViewTransition(() => {
      flushSync(() => {
        setZoomedPhoto(newPhoto ?? null);
        callback?.();
      });
    });
  }

  useEffect(() => {
    albumPhotos.forEach(({ photo }) => {
      if (photo) {
        const img = new Image();
        img.src = photo.photoUrl;
      }
    });
  }, [albumPhotos]);

  return (
    <>
      <article className="album-container" style={albumStyle}>
        <div className="album-photos">
          {albumPhotos.map(({ position, photo }) => {
            const hasPhoto = Boolean(photo);
            let containerClassName = "album-item zoomable";

            let containerStyle: CSSProperties = {};

            if (hasPhoto) {
              containerClassName += " album-photo";

              containerStyle = {
                backgroundImage: `url(${getCDNPhotoUrl(photo!.photoUrl, {
                  h: 450,
                })})`,
                viewTransitionName:
                  hoveredPhoto?.id === photo!.id
                    ? getTransitionName(photo!.id)
                    : undefined,
              };
            }

            return (
              <button
                type="button"
                key={position}
                id={photo ? getTransitionName(photo.id) : undefined}
                className={containerClassName}
                style={containerStyle}
                onClick={() => {
                  toggleZoomedPhoto(photo ?? null);
                }}
                onFocus={
                  photo
                    ? () => {
                        setHoveredPhoto(photo);
                      }
                    : undefined
                }
                onMouseEnter={
                  photo
                    ? () => {
                        setHoveredPhoto(photo);
                      }
                    : undefined
                }
                onMouseLeave={
                  photo
                    ? () => {
                        setHoveredPhoto(null);
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      </article>

      {zoomedPhoto &&
        createPortal(
          <div className="zoomed-photo-container">
            <input
              autoFocus
              type="image"
              style={{
                viewTransitionName: getTransitionName(zoomedPhoto.id),
              }}
              alt="Zoom out"
              src={zoomedPhoto.photoUrl}
              onClick={() => {
                toggleZoomedPhoto(null, () => {
                  setHoveredPhoto(zoomedPhoto);
                  document
                    .getElementById(getTransitionName(zoomedPhoto.id))
                    ?.focus();
                });
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
