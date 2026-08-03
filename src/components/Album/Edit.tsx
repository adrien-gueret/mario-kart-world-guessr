import { useState, useMemo, useCallback, type CSSProperties } from "react";
import { flushSync } from "react-dom";

import CharacterMenu from "@/components/CharacterMenu";
import { useTranslations } from "@/i18n";
import { getCDNPhotoUrl } from "@/services/images";
import type { Album, Photo, AlbumPhoto } from "@/types/photos";
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
import SearchProvider from "@/search/SearchProvider";
import AlbumEditPhotoList from "./AlbumEditPhotoList";

type Props = Album;

export default function AlbumEdit({
  id,
  name,
  author,
  photos,
  isPublished,
  backgroundColor,
  backgroundImage,
  hasLeaderboard,
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
  const [isLeaderboardResetModalOpen, setIsLeaderboardResetModalOpen] =
    useState(false);
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
    [albumPhotos],
  );

  // The album's photo pool when the page loaded, order-independent. Reordering
  // keeps the same leaderboard; only adding/removing photos scopes it to a new
  // pool version (see computeAlbumPhotosHash server-side).
  const initialPhotoIds = useMemo(
    () => photos.map((photo) => photo.id).sort(),
    [photos],
  );

  const hasPhotoSetChanged = useMemo(() => {
    const current = [...selectedPhotoIds].sort();
    return (
      current.length !== initialPhotoIds.length ||
      current.some((photoId, index) => photoId !== initialPhotoIds[index])
    );
  }, [selectedPhotoIds, initialPhotoIds]);

  const shouldWarnLeaderboardReset =
    Boolean(hasLeaderboard) && hasPhotoSetChanged;

  const submitAlbumPhotos = () => {
    const form = document.getElementById(
      "edit-album-photos",
    ) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  const onApplyClick = () => {
    if (shouldWarnLeaderboardReset) {
      setIsLeaderboardResetModalOpen(true);
    } else {
      submitAlbumPhotos();
    }
  };

  const isPhotoSelected = useCallback(
    (photoId: Photo["id"]) => selectedPhotoIds.includes(photoId),
    [selectedPhotoIds],
  );

  const setPhotoAtPosition = (
    position: number,
    photo?:
      | (Omit<AlbumPhoto, "position" | "difficulty"> & { position?: number })
      | undefined,
  ) => {
    setAlbumPhotos((prev) =>
      prev.map((item) =>
        item.position === position
          ? { ...item, photo: photo ? { ...photo, position } : undefined }
          : item,
      ),
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
                backgroundImage: `url(${getCDNPhotoUrl(photo!.photoUrl, {
                  h: 450,
                })})`,
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
              type="button"
              onClick={onApplyClick}
            >
              {translate(
                isProcessing ? "album.edit.photo.processing" : "global.apply",
              )}
            </Button>
          </StickyButtonContainer>
        )}

        <Modal
          title={translate("album.edit.leaderboardReset.title")}
          disableSkew
          noDelay
          isOpen={isLeaderboardResetModalOpen}
          onClose={() => setIsLeaderboardResetModalOpen(false)}
        >
          <div className="row">
            <span>{translate("album.edit.leaderboardReset.warning")}</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setIsLeaderboardResetModalOpen(false)}
            >
              {translate("form.cancel")}
            </Button>
            <Button
              onClick={() => {
                setIsLeaderboardResetModalOpen(false);
                submitAlbumPhotos();
              }}
            >
              {translate("form.confirm")}
            </Button>
          </div>
        </Modal>

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
          keepMounted
          onClose={() => {
            setEditedPosition(null);
          }}
        >
          <p>{translate("account.albums.photo.select.description")}</p>
          <p style={{ fontSize: "0.8rem", color: "#666" }}>
            {translate("photos.filter.by_characters")}
          </p>
          <SearchProvider authorId={author.id}>
            <CharacterMenu />
            <AlbumEditPhotoList
              isPhotoSelected={isPhotoSelected}
              onPhotoSelected={(selectedPhoto) => {
                setPhotoAtPosition(editedPosition!, selectedPhoto);
                setEditedPosition(null);
              }}
            />
          </SearchProvider>
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
