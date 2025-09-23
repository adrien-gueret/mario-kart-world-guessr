import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "@/i18n";

import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import PhotoList from "@/components/PhotoList";
import Surface from "@/components/Surface";
import Tag from "@/components/Tag";

import fetchApi from "@/services/api";

import type { Photo } from "@/types/photos";
import Button from "@/components/Button";
import { useScreen } from "@/screens/ScreensProvider";

import "./Photos.css";

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { translate } = useTranslations();
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

  const validatedPhotoCount = useMemo(
    () => photos.filter((photo) => Boolean(photo.validatedAt)).length,
    [photos]
  );

  const suggestionCount = useMemo(
    () => photos.reduce((acc, photo) => acc + photo.suggestionCount, 0),
    [photos]
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

  const waitingCount = useMemo(
    () => photos.reduce((acc, photo) => (!photo.difficulty ? acc + 1 : acc), 0),
    [photos]
  );

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
        <>
          {validatedPhotoCount > 0 && (
            <ConstraintContainer>
              <h3>{translate("account.photos.stats.title")}</h3>
              <Surface>
                <table className="account-photos-stats">
                  <thead>
                    <tr>
                      <th colSpan={5}>
                        {translate("account.photos.stats.subtitle")}
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <Tag variant="easy">
                          {translate(`photo.difficulty.easy`)}
                        </Tag>
                      </th>
                      <th>
                        <Tag variant="medium">
                          {translate(`photo.difficulty.medium`)}
                        </Tag>
                      </th>
                      <th>
                        <Tag variant="hard">
                          {translate(`photo.difficulty.hard`)}
                        </Tag>
                      </th>
                      <th>
                        <Tag variant="neutral">
                          {translate(`photo.difficulty.waiting`)}
                        </Tag>
                      </th>
                      <th>
                        <Tag variant="neutral">
                          {translate("account.photos.stats.totalLabel")}
                        </Tag>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{easyCount}</td>
                      <td>{mediumCount}</td>
                      <td>{hardCount}</td>
                      <td>{waitingCount}</td>
                      <td>{validatedPhotoCount}</td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  {translate("account.photos.stats.suggestions")(
                    suggestionCount
                  )}
                </p>
              </Surface>
            </ConstraintContainer>
          )}

          {photos.length > 0 && (
            <>
              <h3>{translate("account.your_photos.title")}</h3>
              <PhotoList photos={photos} />
            </>
          )}
        </>
      )}
    </>
  );
}
