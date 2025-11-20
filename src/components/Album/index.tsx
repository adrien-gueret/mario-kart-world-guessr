import { useTranslations } from "@/i18n";
import type { Album } from "@/types/photos";

import "./Album.css";

const photoPlaceholders = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

export default function Album({ name, author, photos, isPublished }: Album) {
  const { translate } = useTranslations();
  return (
    <div className="album-container">
      <h2>{name}</h2>
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

      <div className="album-photos">
        {photoPlaceholders.map((placeholdedrIndex) => (
          <div key={placeholdedrIndex} className="album-placeholder">
            Placeholder
          </div>
        ))}
      </div>
    </div>
  );
}
