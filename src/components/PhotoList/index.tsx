import { useState, type MouseEventHandler } from "react";

import { useTranslations } from "@/i18n";
import type { Photo } from "@/types/photos";

import EyeIcon from "../Icon/Eye";
import Modal from "../Modal";
import PhotoGuesses from "../PhotoGuesses";
import Tag from "../Tag";

import "./PhotoList.css";

type Props = {
  photos: Photo[];
  canOpenDetailsOfNoValidatedPhotos?: boolean;
};

export default function PhotoList({
  photos,
  canOpenDetailsOfNoValidatedPhotos = false,
}: Props) {
  const { translate } = useTranslations();
  const [areDetailsOpen, setAreDetailsOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const selectPhotoId = (photoId: string) => {
    setSelectedPhotoId(photoId);
    setAreDetailsOpen(true);
  };

  const getHandleClick =
    (photoId: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      selectPhotoId(photoId);
    };

  const getHandleKeyDown = (photoId: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectPhotoId(photoId);
    }
  };

  return (
    <>
      <ul className="photo-list">
        {photos.map(
          ({ id, photoUrl, difficulty, suggestionCount, validatedAt }) => {
            const isInteractive =
              canOpenDetailsOfNoValidatedPhotos || Boolean(validatedAt);

            return (
              <li
                key={id}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : -1}
                onClick={getHandleClick(id)}
                onKeyDown={getHandleKeyDown(id)}
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
          }
        )}
      </ul>
      <Modal
        title={translate("photo.details.title")}
        isOpen={areDetailsOpen}
        disableSkew
        noDelay
      >
        {selectedPhotoId && (
          <PhotoGuesses
            photoId={selectedPhotoId}
            onClose={() => {
              setAreDetailsOpen(false);
            }}
          />
        )}
      </Modal>
    </>
  );
}
