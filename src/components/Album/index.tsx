import { useState, useMemo } from "react";

import { useTranslations } from "@/i18n";
import type { Album, Photo, AlbumPhoto } from "@/types/photos";

import useNavigate from "@/services/useNavigate";

import FormBase from "../FormBase";
import Form from "../Form";
import IconButton from "../IconButton";
import Modal from "../Modal";

import "./Album.css";

const photoPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

type Props = Album & {
  isEditing?: boolean;
  availablePhotos?: Photo[];
};

export default function Album({
  id,
  name,
  author,
  photos,
  isPublished,
  isEditing,
  availablePhotos = [],
}: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [albumName, setAlbumName] = useState(name);
  const [isDeleteAlbumModalOpen, setIsDeleteAlbumModalOpen] = useState(false);
  const navigate = useNavigate();

  const { translate } = useTranslations();

  const albumPhotos: Array<{
    position: number;
    photo: AlbumPhoto | undefined;
  }> = useMemo(
    () =>
      photoPositions.map((position) => ({
        position,
        photo: photos.find((p) => p.position === position),
      })),
    [photos]
  );

  return (
    <article className="album-container">
      <header className="album-header">
        {isEditing && (
          <IconButton
            aria-label="Edit album name"
            onClick={() => setIsEditingName((prev) => !prev)}
            color="#007ae1"
          >
            <path
              d={
                isEditingName
                  ? "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8"
                  : "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"
              }
            />
          </IconButton>
        )}

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
              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </IconButton>
          </>
        ) : (
          <>
            <h2 className="album-name">{albumName}</h2>
            {isEditing && (
              <>
                <IconButton
                  color="#e03300"
                  aria-label={translate("account.albums.delete.title")}
                  title={translate("account.albums.delete.title")}
                  onClick={() => setIsDeleteAlbumModalOpen(true)}
                >
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" />
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
          </>
        )}
      </header>

      <div className="album-photos">
        {albumPhotos.map(({ position, photo }) => {
          let containerClassName = "album-item";

          if (photo) {
            containerClassName += " album-photo";
          } else if (isEditing) {
            containerClassName += " album-placeholder";
          }

          return <div key={position} className={containerClassName} />;
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

      {isEditing && (
        <Modal isOpen title="Test" isDrawer noDelay>
          Test
        </Modal>
      )}
    </article>
  );
}
