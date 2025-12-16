import { useState, type MouseEventHandler } from "react";

import { allCharacters } from "@/characters";
import { useTranslations } from "@/i18n";
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
};

export default function PhotoList({
  photos,
  canOpenDetailsOfNoValidatedPhotos = false,
  canEditPhotoCharacters = false,
}: Props) {
  const { translate } = useTranslations();
  const [areDetailsOpen, setAreDetailsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const selectPhoto = (photo: Photo) => {
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
      <ul className="photo-list">
        {photos.map((photo) => {
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
              <img draggable={false} src={photoUrl} alt="" loading="lazy" />

              {validatedAt ? (
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

            {canEditPhotoCharacters && Boolean(selectedPhoto.validatedAt) && (
              <div className="photo-character-edit">
                <FormBase
                  action="/update-photo-characters"
                  method="POST"
                  successMessage={translate("photo.editCharacters.success")}
                >
                  <div className="photo-character-edit-form">
                    <p>{translate("photo.editCharacters.title")}</p>
                    <input
                      type="hidden"
                      name="photoId"
                      value={selectedPhoto.id}
                    />
                    <div className="photo-character-checkboxes">
                      {allCharacters.map((character) => (
                        <>
                          <input
                            id={`check-box-photo-character-${character}`}
                            name="characters[]"
                            value={character}
                            className="photo-character-real-input"
                            type="checkbox"
                            defaultChecked={false} // TODO
                          />
                          <label
                            key={character}
                            className="photo-character-checkbox"
                            htmlFor={`check-box-photo-character-${character}`}
                          >
                            <img
                              className="photo-character-image"
                              src={`./ui/pins/icon-${character}.png`}
                              alt=""
                            />
                            {translate(`${character}.name`)}
                          </label>
                        </>
                      ))}
                    </div>

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
