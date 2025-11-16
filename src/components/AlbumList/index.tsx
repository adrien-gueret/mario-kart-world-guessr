import { useState, type MouseEventHandler } from "react";

import Form from "../Form";
import Modal from "../Modal";

import { useTranslations } from "@/i18n";
import type { Album } from "@/types/photos";

import "./AlbumList.css";

type Props = {
  albums: Album[];
  canCreateNewAlbum?: boolean;
};

export default function AlbumList({ albums, canCreateNewAlbum }: Props) {
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);

  const { translate } = useTranslations();

  const selectAlbumId = (albumId: number) => {
    console.log("Selected album ID:", albumId);
  };

  const createAlbum = () => {
    setIsCreateAlbumModalOpen(true);
  };

  const getHandleClickAlbum =
    (albumId: number): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      selectAlbumId(albumId);
    };

  const getHandleKeyDownAlbum =
    (albumId: number) => (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectAlbumId(albumId);
      }
    };

  const handleClickNewAlbum: MouseEventHandler = (e) => {
    e.preventDefault();
    createAlbum();
  };

  const handleKeyDownNewAlbum = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      createAlbum();
    }
  };

  return (
    <>
      <ul className="album-list">
        {canCreateNewAlbum && (
          <li
            className="new-album"
            role="link"
            tabIndex={0}
            onClick={handleClickNewAlbum}
            onKeyDown={handleKeyDownNewAlbum}
          >
            {translate("account.albums.create.title")}
          </li>
        )}
        {albums.map(({ id, name }) => {
          return (
            <li
              key={id}
              role="link"
              tabIndex={0}
              onClick={getHandleClickAlbum(id)}
              onKeyDown={getHandleKeyDownAlbum(id)}
            >
              <div className="album-name">{name}</div>
            </li>
          );
        })}
      </ul>
      {canCreateNewAlbum && (
        <Modal
          title={translate("account.albums.create.title")}
          disableSkew
          noDelay
          isOpen={isCreateAlbumModalOpen}
        >
          <Form
            method="POST"
            action="/create-album"
            successMessage={translate("account.albums.create.success")}
            onSuccess={(response: { album: Album }) => {
              console.log("Created album:", response.album);
            }}
          >
            <div className="row">
              <label htmlFor="form-albumname">
                {translate("account.albums.create.name")}
              </label>

              <input
                type="text"
                name="albumname"
                id="form-albumname"
                required
                maxLength={100}
              />
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
}
