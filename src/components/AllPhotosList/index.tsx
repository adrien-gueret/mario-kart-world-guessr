import {
  useInfiniteHits,
  useInstantSearch,
  useStats,
} from "react-instantsearch";
import { useMemo } from "react";

import type { MarioCharacter, UsableMarioCharacter } from "@/characters";
import { useTranslations } from "@/i18n";
import type { Photo } from "@/types/photos";

import Button from "../Button";
import PhotoListContainer from "../PhotoListContainer";

import "./AllPhotosList.css";

export type HitPhoto = {
  id: string;
  photoUrl: string;
  difficulty?: Photo["difficulty"];
  suggestionCount?: number;
  x?: number;
  y?: number;
  author: {
    id: number;
    name: string;
    character: UsableMarioCharacter | null;
  };
  characters: MarioCharacter[];
  validatedAt: string;
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

  const photos = useMemo<Photo[]>(
    () =>
      items.map((photo) => ({
        id: photo.id,
        photoUrl: photo.photoUrl,
        difficulty: photo.difficulty ?? null,
        suggestionCount: photo.suggestionCount ?? 0,
        characters: photo.characters,
        validatedAt: photo.validatedAt,
        x: photo.x ?? 0,
        y: photo.y ?? 0,
      })),
    [items],
  );

  const photosById = useMemo(
    () => new Map(items.map((photo) => [photo.id, photo])),
    [items],
  );

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
      <PhotoListContainer
        photos={photos}
        shouldHidePhotoStats
        shouldHideFiltersAndStats
        isMini
        onPhotoClick={(photo) => {
          const hit = photosById.get(photo.id);

          if (hit) {
            onPhotoClick(hit);
          }
        }}
      />

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
