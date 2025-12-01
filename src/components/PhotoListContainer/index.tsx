import { useState, useMemo } from "react";

import ConstraintContainer from "@/components/ConstraintContainer";
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
  suggestionLabelKey?:
    | "account.photos.stats.suggestions"
    | "all-photos.stats.suggestions";
};

export default function PhotoListContainer({
  photos,
  canOpenDetailsOfNoValidatedPhotos = false,
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
    [filteredPhotos]
  );

  const easyCount = useMemo(
    () =>
      photos.reduce(
        (acc, photo) => (photo.difficulty === "easy" ? acc + 1 : acc),
        0
      ),
    [photos]
  );

  const mediumCount = useMemo(
    () =>
      photos.reduce(
        (acc, photo) => (photo.difficulty === "medium" ? acc + 1 : acc),
        0
      ),
    [photos]
  );

  const hardCount = useMemo(
    () =>
      photos.reduce(
        (acc, photo) => (photo.difficulty === "hard" ? acc + 1 : acc),
        0
      ),
    [photos]
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

  return (
    <>
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
              <svg
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                width={24}
                style={{ verticalAlign: "bottom", marginRight: 8 }}
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"></path>
              </svg>

              {translate(suggestionLabelKey)(
                suggestionCount.toLocaleString(currentLocale),
                selectedDifficulty
              )}
            </div>
          </Surface>
        </div>
      </ConstraintContainer>

      <PhotoList
        photos={filteredPhotos}
        canOpenDetailsOfNoValidatedPhotos={canOpenDetailsOfNoValidatedPhotos}
      />
    </>
  );
}
