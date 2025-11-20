import { useState } from "react";
import Form from "../Form";
import Icon from "../Icon";
import { useTranslations } from "@/i18n";
import type { Album } from "@/types/photos";

import "./Album.css";

const photoPlaceholders = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

export default function Album({ name, author, photos, isPublished }: Album) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [albumName, setAlbumName] = useState(name);

  const { translate } = useTranslations();

  return (
    <div className="album-container">
      <h2>
        <button
          type="button"
          aria-label="Edit album name"
          className="album-edit-name-button"
          onClick={() => setIsEditingName((prev) => !prev)}
        >
          <Icon>
            <path
              d={
                isEditingName
                  ? "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8"
                  : "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"
              }
            ></path>
          </Icon>
        </button>
        {isEditingName ? (
          <Form
            method="PATCH"
            action="/update-album-name"
            successMessage={"OK"}
            onSuccess={(album) => {
              setIsEditingName(false);
              setAlbumName(album.name);
            }}
          >
            <input
              type="text"
              defaultValue={albumName}
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          </Form>
        ) : (
          albumName
        )}
      </h2>

      <div className="album-photos">
        {photoPlaceholders.map((placeholdedrIndex) => (
          <div key={placeholdedrIndex} className="album-item album-placeholder">
            Placeholder
          </div>
        ))}
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
    </div>
  );
}
