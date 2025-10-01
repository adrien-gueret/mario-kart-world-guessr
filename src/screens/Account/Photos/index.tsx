import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "@/i18n";

import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import PhotoList from "@/components/PhotoList";
import Surface from "@/components/Surface";
import Tabs from "@/components/Tabs";
import Tag from "@/components/Tag";

import fetchApi from "@/services/api";

import type { Photo, PhotoFilter } from "@/types/photos";
import Button from "@/components/Button";
import { useScreen } from "@/screens/ScreensProvider";

import "./Photos.css";

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<PhotoFilter>("all");

  const { translate, currentLocale } = useTranslations();
  const { setCurrentScreenName } = useScreen();

  useEffect(() => {
    async function fetchPhotos() {
      setIsLoading(true);

      const response = await fetchApi("/my-photos");
      const photos = await response.json();

      setPhotos(photos);
      setIsLoading(false);
    }

    fetchPhotos();
  }, []);

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
        <Surface>
          <p>{translate("account.photos.description")}</p>
        </Surface>

        <div className="account-photos-upload-button">
          <Button
            onClick={() => setCurrentScreenName("Upload")}
            variant="primary"
          >
            {translate("upload.title")}
          </Button>
        </div>
      </ConstraintContainer>

      {isLoading ? (
        <Loader />
      ) : (
        photoCount > 0 && (
          <>
            <h3 className="account-photos-subtitle">
              {translate("account.your_photos.title")}
            </h3>

            <ConstraintContainer>
              <div className="account-photos-filters">
                <Tabs
                  activeTab={selectedDifficulty}
                  onTabChange={setSelectedDifficulty}
                  tabs={photoTabs.filter((tab) => tab.shouldBeRendered)}
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

                    {translate("account.photos.stats.suggestions")(
                      suggestionCount.toLocaleString(currentLocale),
                      selectedDifficulty
                    )}
                  </div>
                </Surface>
              </div>
            </ConstraintContainer>

            <PhotoList photos={filteredPhotos} />
          </>
        )
      )}
    </>
  );
}
