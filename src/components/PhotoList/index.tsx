import { useState, type MouseEventHandler } from "react";

import { useTranslations } from "@/i18n";
import type { Photo } from "@/types/photos";

import Modal from "../Modal";
import PhotoGuesses from "../PhotoGuesses";
import Tag from "../Tag";

import "./PhotoList.css";

type Props = {
  photos: Photo[];
};

export default function PhotoList({ photos }: Props) {
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
          ({ id, photoUrl, difficulty, suggestionCount, validatedAt }) => (
            <li
              key={id}
              role={validatedAt ? "button" : undefined}
              tabIndex={validatedAt ? 0 : -1}
              onClick={getHandleClick(id)}
              onKeyDown={getHandleKeyDown(id)}
              className={!validatedAt ? "not-validated" : ""}
            >
              <img draggable={false} src={photoUrl} alt="" loading="lazy" />

              {validatedAt ? (
                <>
                  <span className="photo-suggestions">
                    <Tag>
                      <svg
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"></path>
                      </svg>
                      <span>{suggestionCount}</span>
                    </Tag>
                  </span>
                  {difficulty && (
                    <span className="photo-difficulty">
                      <Tag variant={difficulty}>
                        {translate(`photo.difficulty.${difficulty}`)}
                      </Tag>
                    </span>
                  )}
                </>
              ) : (
                <div className="photo-validation-pending">
                  {translate("photo.validation.pending")}
                </div>
              )}
            </li>
          )
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
