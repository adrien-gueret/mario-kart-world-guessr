import { useState, useMemo } from "react";

import ConstraintContainer from "@/components/ConstraintContainer";
import EyeIcon from "@/components/Icon/Eye";
import PhotoList from "@/components/PhotoList";
import Surface from "@/components/Surface";
import Tabs from "@/components/Tabs";
import Tag from "@/components/Tag";
import { useTranslations } from "@/i18n";
import type { Photo, PhotoFilter } from "@/types/photos";

import "./PhotoListContainer.css";

type Props = {
  photos: Photo[];
  canOpenDetailsOfNoValidatedPhotos?: boolean;
  canEditPhotoCharacters?: boolean;
  shouldHideFiltersAndStats?: boolean;
  shouldHidePhotoStats?: boolean;
  onPhotoClick?: (photo: Photo) => void;
  suggestionLabelKey?:
    | "account.photos.stats.suggestions"
    | "all-photos.stats.suggestions";
  isMini?: boolean;
};

export default function PhotoListContainer({
  photos,
  canOpenDetailsOfNoValidatedPhotos = false,
  canEditPhotoCharacters = false,
  shouldHideFiltersAndStats = false,
  shouldHidePhotoStats = false,
  isMini = false,
  onPhotoClick,
  suggestionLabelKey = "all-photos.stats.suggestions",
}: Props) {
  const { translate, currentLocale } = useTranslations();
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<PhotoFilter>("all");

  const filteredPhotos = useMemo(() => {
    if (selectedDifficulty === "all") {
      return photos;
    }

    return photos.filter((photo) => photo.difficulty === selectedDifficulty);
  }, [photos, selectedDifficulty]);

  const suggestionCount = useMemo(
    () => filteredPhotos.reduce((acc, photo) => acc + photo.suggestionCount, 0),
    [filteredPhotos],
  );

  const easyCount = useMemo(
    () =>
      photos.reduce(
        (acc, photo) => (photo.difficulty === "easy" ? acc + 1 : acc),
        0,
      ),
    [photos],
  );

  const mediumCount = useMemo(
    () =>
      photos.reduce(
        (acc, photo) => (photo.difficulty === "medium" ? acc + 1 : acc),
        0,
      ),
    [photos],
  );

  const hardCount = useMemo(
    () =>
      photos.reduce(
        (acc, photo) => (photo.difficulty === "hard" ? acc + 1 : acc),
        0,
      ),
    [photos],
  );

  const photoCount = photos.length;

  const photoTabs: Array<{
    value: typeof selectedDifficulty;
    children: React.ReactNode;
    shouldBeRendered: boolean;
  }> = [
    {
      value: "all",
      children: (
        <div>
          <Tag>{translate("photo.difficulty.all")}</Tag>{" "}
          <span> ({photoCount.toLocaleString(currentLocale)})</span>
        </div>
      ),
      shouldBeRendered: photoCount > 0,
    },
    {
      value: "easy",
      children: (
        <div>
          <Tag variant="easy">{translate(`photo.difficulty.easy`)}</Tag>
          <span> ({easyCount.toLocaleString(currentLocale)})</span>
        </div>
      ),
      shouldBeRendered: easyCount > 0,
    },
    {
      value: "medium",
      children: (
        <div>
          <Tag variant="medium">{translate(`photo.difficulty.medium`)}</Tag>
          <span> ({mediumCount.toLocaleString(currentLocale)})</span>
        </div>
      ),
      shouldBeRendered: mediumCount > 0,
    },
    {
      value: "hard",
      children: (
        <div>
          <Tag variant="hard">{translate(`photo.difficulty.hard`)}</Tag>
          <span> ({hardCount.toLocaleString(currentLocale)})</span>
        </div>
      ),
      shouldBeRendered: hardCount > 0,
    },
  ];

  const displayedPhotos = shouldHideFiltersAndStats ? photos : filteredPhotos;

  return (
    <>
      {!shouldHideFiltersAndStats && (
        <ConstraintContainer>
          <div className="photo-list-container-filters">
            <Tabs
              activeTab={selectedDifficulty}
              onTabChange={setSelectedDifficulty}
              tabs={photoTabs
                .filter((tab) => tab.shouldBeRendered)
                .map(({ shouldBeRendered, ...tabProps }) => tabProps)}
              variant="chips-small"
            />
            <Surface>
              <div>
                <EyeIcon
                  width={24}
                  style={{ verticalAlign: "bottom", marginRight: 8 }}
                />

                {translate(suggestionLabelKey)(
                  suggestionCount.toLocaleString(currentLocale),
                  selectedDifficulty,
                )}
              </div>
            </Surface>
          </div>
        </ConstraintContainer>
      )}

      <PhotoList
        photos={displayedPhotos}
        shouldHidePhotoStats={shouldHidePhotoStats}
        canOpenDetailsOfNoValidatedPhotos={canOpenDetailsOfNoValidatedPhotos}
        canEditPhotoCharacters={canEditPhotoCharacters}
        onPhotoClick={onPhotoClick}
        isMini={isMini}
      />
    </>
  );
}
