import { useState, type MouseEventHandler } from "react";

import { useTranslations } from "@/i18n";
import { useScreen } from "@/screens/ScreensProvider";
import type { Album } from "@/types/photos";

import Form from "../Form";
import Modal from "../Modal";

import "./AlbumList.css";

type Props = {
  albums: Album[];
  canCreateNewAlbum?: boolean;
};

export default function AlbumList({ albums, canCreateNewAlbum }: Props) {
  const { setCurrentScreenName } = useScreen();

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
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"></path>
            </svg>
            <div className="album-name">
              {translate("account.albums.create.title")}
            </div>
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
            onCancel={() => setIsCreateAlbumModalOpen(false)}
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
