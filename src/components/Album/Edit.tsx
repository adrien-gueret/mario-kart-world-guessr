import { useState, useMemo, useCallback, type CSSProperties } from "react";
import { flushSync } from "react-dom";

import { useTranslations } from "@/i18n";
import type { Album, Photo, AlbumPhoto } from "@/types/photos";
import ErrorScreen from "@/screens/Error";
import useNavigate from "@/services/useNavigate";

import AlbumPublicationCallout from "../AlbumPublicationCallout";
import Button from "../Button";
import PlusIcon from "../Icon/Plus";
import Icon from "../Icon";
import ChangeIcon from "../Icon/Change";
import DropIcon from "../Icon/Drop";
import TrashIcon from "../Icon/Trash";
import ValidIcon from "../Icon/Valid";
import FormBase from "../FormBase";
import Form from "../Form";
import IconButton from "../IconButton";
import Modal from "../Modal";
import StickyButtonContainer from "../StickyButtonContainer";

import getPositionedAlbumPhotos from "./getPositionedAlbumPhotos";
import AlbumBackgroundForm from "./AlbumBackgroundForm";

type Props = Album & {
  availablePhotos?: Photo[];
};

export default function AlbumEdit({
  id,
  name,
  author,
  photos,
  isPublished,
  backgroundColor,
  backgroundImage,
  availablePhotos = [],
}: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [albumName, setAlbumName] = useState(name);
  const [albumBackgroundColor, setAlbumBackgroundColor] =
    useState(backgroundColor);
  const [albumBackgroundImage, setAlbumBackgroundImage] =
    useState(backgroundImage);
  const [isDeleteAlbumModalOpen, setIsDeleteAlbumModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [editedPosition, setEditedPosition] = useState<number | null>(null);
  const [movingPhoto, setMovingPhoto] = useState<{
    photo: AlbumPhoto;
    position: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const isMovingPhoto = movingPhoto !== null;

  const albumStyle: CSSProperties & Record<`--${string}`, string> = {
    ["--album-color"]: albumBackgroundColor,
    ["--album-image"]: `url("./backgrounds/albums/${albumBackgroundImage}.jpg")`,
  };

  const { translate } = useTranslations();

  const [albumPhotos, setAlbumPhotos] = useState<
    Array<{
      position: number;
      photo: AlbumPhoto | undefined;
    }>
  >(() => getPositionedAlbumPhotos(photos));

  const selectedPhotoIds = useMemo(
    () =>
      albumPhotos.filter((item) => item.photo).map((item) => item.photo!.id),
    [albumPhotos]
  );

  const isPhotoSelected = useCallback(
    (photoId: Photo["id"]) => selectedPhotoIds.includes(photoId),
    [selectedPhotoIds]
  );

  const setPhotoAtPosition = (
    position: number,
    photo?: (Omit<AlbumPhoto, "position"> & { position?: number }) | undefined
  ) => {
    setAlbumPhotos((prev) =>
      prev.map((item) =>
        item.position === position
          ? { ...item, photo: photo ? { ...photo, position } : undefined }
          : item
      )
    );
  };

  return (
    <>
      <article className="album-container" style={albumStyle}>
        <header className="album-header">
          <IconButton
            aria-label="Edit album name"
            onClick={() => setIsEditingName((prev) => !prev)}
            color="#007ae1"
          >
            <Icon>
              <path
                d={
                  isEditingName
                    ? "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8"
                    : "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"
                }
              />
            </Icon>
          </IconButton>

          {isEditingName ? (
            <>
              <FormBase
                id="edit-album-name-form"
                method="PATCH"
                action="/update-album-name"
                successMessage={translate("album.edit.name.success")}
                onSuccess={({ album }) => {
                  setIsEditingName(false);
                  setAlbumName(album.name);
                }}
              >
                <input type="hidden" name="albumId" value={id} />
                <input
                  type="text"
                  name="albumName"
                  defaultValue={albumName}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
              </FormBase>
              <IconButton
                aria-label="Edit album name"
                type="submit"
                color="green"
                form="edit-album-name-form"
              >
                <ValidIcon />
              </IconButton>
            </>
          ) : (
            <>
              <h2 className="album-name">{albumName}</h2>

              <IconButton
                aria-label={translate("account.albums.background.title")}
                title={translate("account.albums.background.title")}
                onClick={() => setIsBackgroundModalOpen(true)}
              >
                <Icon>
                  <path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2zm6 9-4 5h12l-3-4-2.03 2.71zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5M20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2m0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4z" />
                </Icon>
              </IconButton>

              <IconButton
                color="#e03300"
                aria-label={translate("account.albums.delete.title")}
                title={translate("account.albums.delete.title")}
                onClick={() => setIsDeleteAlbumModalOpen(true)}
              >
                <TrashIcon />
              </IconButton>
              <Modal
                title={translate("account.albums.delete.title")}
                disableSkew
                noDelay
                isOpen={isDeleteAlbumModalOpen}
              >
                <Form
                  method="DELETE"
                  action="/delete-album"
                  successMessage={translate("account.albums.delete.success")}
                  submitLabel={translate("form.confirm")}
                  onSuccess={() => {
                    navigate("/account/albums");
                  }}
                  onCancel={() => setIsDeleteAlbumModalOpen(false)}
                >
                  <div className="row">
                    <span>{translate("account.albums.delete.warning")}</span>
                    <input type="hidden" name="albumId" value={id} />
                  </div>
                </Form>
              </Modal>
            </>
          )}
        </header>

        <div className="album-photos">
          {albumPhotos.map(({ position, photo }) => {
            const hasPhoto = Boolean(photo);

            let containerClassName = "album-item";
            let UpdateIcon = PlusIcon;
            let containerStyle: CSSProperties = {};

            if (hasPhoto) {
              containerClassName += " album-photo";
              UpdateIcon = ChangeIcon;
              containerStyle = {
                backgroundImage: `url(${photo!.photoUrl})`,
                viewTransitionName: `album-photo-${photo!.id}`,
              };
            } else {
              containerClassName += " album-placeholder";
            }

            if (isMovingPhoto) {
              UpdateIcon = DropIcon;
              containerClassName += " album-photo-move-target";
            }

            return (
              <div className="album-photo-edit-container" key={position}>
                <button
                  type="button"
                  className={containerClassName}
                  onClick={() => {
                    if (isMovingPhoto) {
                      document.startViewTransition(() => {
                        flushSync(() => {
                          setPhotoAtPosition(position, movingPhoto!.photo);
                          setPhotoAtPosition(movingPhoto.position, photo);
                          setMovingPhoto(null);
                        });
                      });
                    } else {
                      setEditedPosition(position);
                    }
                  }}
                  style={containerStyle}
                >
                  <UpdateIcon width="64px" />
                </button>
                {photo && !isMovingPhoto && (
                  <>
                    <input
                      type="hidden"
                      name={`position[${position}]`}
                      value={photo.id}
                      form="edit-album-photos"
                    />
                    <span className="album-photo-move-container">
                      <IconButton
                        color="#007ae1"
                        aria-label={translate("account.albums.move.photo")}
                        title={translate("account.albums.move.photo")}
                        onClick={() => {
                          setMovingPhoto({ photo, position });
                        }}
                      >
                        <Icon>
                          <path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4zm5.98-1v-3H22V8h-7.01V5L11 9z" />
                        </Icon>
                      </IconButton>
                    </span>

                    <span className="album-photo-delete-container">
                      <IconButton
                        color="#e03300"
                        aria-label={translate("account.albums.delete.photo")}
                        title={translate("account.albums.delete.photo")}
                        onClick={() => setPhotoAtPosition(position!)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <FormBase
          id="edit-album-photos"
          method="POST"
          action="/update-album-photos"
          successMessage={translate("album.edit.photos.success")}
          onProcessingChange={setIsProcessing}
        >
          <input type="hidden" name="albumId" value={id} />
        </FormBase>

        {!isMovingPhoto && (
          <StickyButtonContainer>
            <Button
              disabled={isProcessing}
              form="edit-album-photos"
              type="submit"
            >
              {translate(
                isProcessing ? "album.edit.photo.processing" : "global.apply"
              )}
            </Button>
          </StickyButtonContainer>
        )}

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

        <Modal
          isOpen={editedPosition !== null}
          title={translate("account.albums.photo.select.title")}
          isDrawer
          noDelay
          onClose={() => {
            setEditedPosition(null);
          }}
        >
          {availablePhotos.length === 0 ? (
            <ErrorScreen
              title={translate("account.albums.photo.select.description")}
              description={translate("account.albums.photo.select.none")}
            />
          ) : (
            <>
              <p>{translate("account.albums.photo.select.description")}</p>
              <ul className="album-photos">
                {availablePhotos.map((photo) => {
                  const isSelected = isPhotoSelected(photo.id);
                  return (
                    <li
                      key={photo.id}
                      className={`album-item album-photo ${
                        isSelected ? "selected" : ""
                      }`}
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
                              setPhotoAtPosition(editedPosition!, photo);
                              setEditedPosition(null);
                            });
                          });
                        }}
                      >
                        <img src={photo.photoUrl} alt="" loading="lazy" />
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
            </>
          )}
        </Modal>

        <Modal
          isOpen={isBackgroundModalOpen}
          title={translate("account.albums.background.title")}
          isDrawer
          noDelay
          onClose={() => {
            setIsBackgroundModalOpen(false);
          }}
        >
          <AlbumBackgroundForm
            albumId={id}
            defaultImage={backgroundImage}
            defaultColor={backgroundColor}
            onCancel={() => setIsBackgroundModalOpen(false)}
            onSuccess={(newImage, newColor) => {
              setAlbumBackgroundImage(newImage);
              setAlbumBackgroundColor(newColor);
              setIsBackgroundModalOpen(false);
            }}
          />
        </Modal>
      </article>

      <AlbumPublicationCallout
        albumId={id}
        albumName={albumName}
        isPublished={isPublished}
        hideEditButton
      />

      <div style={{ alignSelf: "center" }}>
        <Button
          variant="secondary"
          onClick={() => navigate("/account/albums", { viewTransition: true })}
        >
          {translate("album.edit.back")}
        </Button>
      </div>
    </>
  );
}
