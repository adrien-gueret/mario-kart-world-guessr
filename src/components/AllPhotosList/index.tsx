import {
  useInfiniteHits,
  useInstantSearch,
  useStats,
} from "react-instantsearch";

import type { MarioCharacter, UsableMarioCharacter } from "@/characters";
import { useTranslations } from "@/i18n";
import { getCDNPhotoUrl } from "@/services/images";

import Button from "../Button";

import "./AllPhotosList.css";

export type HitPhoto = {
  id: string;
  photoUrl: string;
  author: {
    id: number;
    name: string;
    character: UsableMarioCharacter | null;
  };
  characters: MarioCharacter[];
  validatedAt: number;
};

type Props = {
  onPhotoClick: (photo: HitPhoto) => void;
};

export default function AllPhotosList({ onPhotoClick }: Props) {
  const { translate } = useTranslations();
  const { items, isLastPage, showMore } = useInfiniteHits<HitPhoto>();
  const { nbHits } = useStats();
  const { status } = useInstantSearch();
  const isLoading = status === "loading" || status === "stalled";

  if (items.length === 0 && !isLoading) {
    return (
      <p className="all-photos-list__empty">{translate("all-photos.empty")}</p>
    );
  }

  return (
    <>
      <p className="all-photos-list__count">
        {translate("all-photos.photo_count")(nbHits)}
      </p>
      <ul className="all-photos-list">
        {items.map((photo) => (
          <li key={photo.id} className="all-photos-list__item">
            <button
              type="button"
              className="all-photos-list__button"
              onClick={() => onPhotoClick(photo)}
            >
              <img
                src={getCDNPhotoUrl(photo.photoUrl, { h: 225 })}
                alt=""
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>

      {!isLastPage && (
        <div className="all-photos-list__load-more">
          <Button
            type="button"
            variant="secondary"
            onClick={() => showMore()}
            disabled={isLoading}
          >
            {translate(
              isLoading ? "all-photos.loading" : "all-photos.load_more",
            )}
          </Button>
        </div>
      )}
    </>
  );
}
