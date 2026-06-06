import { useState, useEffect, type MouseEventHandler } from "react";

import { type MarioCharacter } from "@/characters";
import AllCharactersCheckboxes from "@/components/AllCharactersCheckboxes";
import { useTranslations } from "@/i18n";
import { getCDNPhotoUrl } from "@/services/images";
import type { Photo } from "@/types/photos";

import Button from "../Button";
import FormBase from "../FormBase";
import EyeIcon from "../Icon/Eye";
import Modal from "../Modal";
import PhotoGuesses from "../PhotoGuesses";
import Tag from "../Tag";

import "./PhotoList.css";

type Props = {
  photos: Photo[];
  canOpenDetailsOfNoValidatedPhotos?: boolean;
  canEditPhotoCharacters?: boolean;
  shouldHidePhotoStats?: boolean;
  isMini?: boolean;
  onPhotoClick?: (photo: Photo) => void;
};

export default function PhotoList({
  photos,
  canOpenDetailsOfNoValidatedPhotos = false,
  canEditPhotoCharacters = false,
  shouldHidePhotoStats = false,
  isMini = false,
  onPhotoClick,
}: Props) {
  const { translate } = useTranslations();
  const [areDetailsOpen, setAreDetailsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotos, setCurrentPhotos] = useState(photos);

  useEffect(() => {
    setCurrentPhotos(photos);
  }, [photos]);

  const selectPhoto = (photo: Photo) => {
    if (onPhotoClick) {
      onPhotoClick(photo);
      return;
    }

    setSelectedPhoto(photo);
    setAreDetailsOpen(true);
  };

  const getHandleClick =
    (photo: Photo): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      selectPhoto(photo);
    };

  const getHandleKeyDown = (photo: Photo) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectPhoto(photo);
    }
  };

  return (
    <>
      <ul className={`photo-list${isMini ? " mini" : ""}`}>
        {currentPhotos.map((photo) => {
          const { id, photoUrl, difficulty, suggestionCount, validatedAt } =
            photo;
          const isInteractive =
            canOpenDetailsOfNoValidatedPhotos || Boolean(validatedAt);

          return (
            <li
              key={id}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : -1}
              onClick={getHandleClick(photo)}
              onKeyDown={getHandleKeyDown(photo)}
              className={!isInteractive ? "not-validated" : ""}
            >
              <img
                draggable={false}
                src={getCDNPhotoUrl(photoUrl, { h: 225 })}
                alt=""
                loading="lazy"
              />

              {canEditPhotoCharacters && Boolean(photo.characters.length) && (
                <div className="photo-edit-characters">
                  {photo.characters.map((character) => (
                    <img
                      className="photo-characters-image"
                      key={character}
                      src={`./ui/pins/icon-${character}.png`}
                      alt=""
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              {validatedAt ? (
                !shouldHidePhotoStats && (
                  <>
                    <span className="photo-suggestions">
                      <Tag>
                        <EyeIcon />
                        <span>{suggestionCount}</span>
                      </Tag>
                    </span>

                    <span className="photo-difficulty">
                      {difficulty ? (
                        <Tag variant={difficulty}>
                          {translate(`photo.difficulty.${difficulty}`)}
                        </Tag>
                      ) : (
                        <span
                          title={translate(`photo.difficulty.waiting.tooltip`)}
                          style={{ cursor: "help" }}
                        >
                          <Tag variant="neutral">
                            {translate(`photo.difficulty.waiting`)}
                          </Tag>
                        </span>
                      )}
                    </span>
                  </>
                )
              ) : (
                <div className="photo-validation-pending">
                  {translate("photo.validation.pending")}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Modal
        isDrawer
        title={translate("photo.details.title")}
        isOpen={areDetailsOpen}
        onClose={() => {
          setAreDetailsOpen(false);
        }}
        noDelay
      >
        {selectedPhoto && (
          <div className="photo-details-modal-content">
            <PhotoGuesses photoId={selectedPhoto.id} />

            <img
              className="photo-details-image"
              src={selectedPhoto.photoUrl}
              alt=""
              draggable={false}
            />

            {canEditPhotoCharacters && (
              <div className="photo-character-edit">
                <FormBase
                  action="/update-photo-characters"
                  method="POST"
                  successMessage={translate("photo.editCharacters.success")}
                  onSuccess={(_, formData) => {
                    const characters: MarioCharacter[] =
                      (formData.getAll("characters[]") as MarioCharacter[]) ??
                      [];
                    setCurrentPhotos((prevPhotos) =>
                      prevPhotos.map((photo) =>
                        photo.id === selectedPhoto.id
                          ? { ...photo, characters }
                          : photo,
                      ),
                    );
                    setAreDetailsOpen(false);
                  }}
                >
                  <div className="photo-character-edit-form">
                    <p>{translate("photo.editCharacters.title")}</p>
                    <input
                      type="hidden"
                      name="photoId"
                      value={selectedPhoto.id}
                    />
                    <AllCharactersCheckboxes
                      defaultSelectedCharacters={selectedPhoto.characters}
                    />

                    <Button variant="secondary" type="submit">
                      {translate("global.apply")}
                    </Button>
                  </div>
                </FormBase>
              </div>
            )}

            <Button
              onClick={() => {
                setAreDetailsOpen(false);
              }}
            >
              {translate("close.label")}
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
