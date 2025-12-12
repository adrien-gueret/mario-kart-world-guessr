import { useState, useMemo, type CSSProperties } from "react";
import { flushSync, createPortal } from "react-dom";

import Button from "@/components/Button";
import { useTranslations } from "@/i18n";
import useNavigate from "@/services/useNavigate";
import type { Album, AlbumPhoto } from "@/types/photos";

import getPositionedAlbumPhotos from "./getPositionedAlbumPhotos";
import AlbumPublicationCallout from "../AlbumPublicationCallout";

type Props = Album & {
  isCurrentUserTheAuthor?: boolean;
};

function getTransitionName(photoId: string) {
  return `album-photo-${photoId}`;
}

type MinimalPhoto = {
  id: string;
  photoUrl: string;
};

export default function AlbumReadOnly({
  id,
  coverUrl,
  name,
  author,
  photos,
  isPublished,
  backgroundColor,
  backgroundImage,
  isCurrentUserTheAuthor,
}: Props) {
  const { translate } = useTranslations();
  const [zoomedPhoto, setZoomedPhoto] = useState<MinimalPhoto | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<MinimalPhoto | null>(null);
  const navigate = useNavigate();

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

  const publishCallout = isCurrentUserTheAuthor ? (
    <AlbumPublicationCallout
      albumId={id}
      albumName={name}
      isPublished={isPublished}
      hideShowButton
    />
  ) : null;

  function toggleZoomedPhoto(
    newPhoto: MinimalPhoto | null = null,
    callback?: () => void
  ) {
    document.startViewTransition(() => {
      flushSync(() => {
        setZoomedPhoto(newPhoto ?? null);
        callback?.();
      });
    });
  }

  return (
    <>
      <img
        style={{
          width: "80%",
          maxWidth: "768px",
          margin: "auto",
        }}
        src={coverUrl}
        alt=""
      />

      {publishCallout}

      <article className="album-container" style={albumStyle}>
        <header className="album-header">
          <h2 className="album-name">{name}</h2>
        </header>

        <div className="album-photos">
          {albumPhotos.map(({ position, photo }) => {
            const hasPhoto = Boolean(photo);
            let containerClassName = "album-item zoomable";

            let containerStyle: CSSProperties = {};

            if (hasPhoto) {
              containerClassName += " album-photo";

              containerStyle = {
                backgroundImage: `url(${photo!.photoUrl})`,
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

        <p className="album-author">
          <span>
            {translate("album.by")} <b>{author.name}</b>
          </span>
          {author.character && (
            <img
              style={{ width: "32px", verticalAlign: "text-bottom" }}
              src={`./ui/pins/icon-${author.character}.png`}
              alt=""
            />
          )}
        </p>
      </article>

      <div>
        <Button
          onClick={() => {
            navigate("/account/albums");
          }}
        >
          {isCurrentUserTheAuthor ? "Mes albums" : "Créer mon propre album"}
        </Button>
      </div>

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
          document.body
        )}
    </>
  );
}
