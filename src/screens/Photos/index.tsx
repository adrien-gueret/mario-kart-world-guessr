import { useState, useEffect, useRef, type MouseEventHandler } from "react";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import PhotoList from "@/components/PhotoList";
import Text from "@/components/Text";

import { useTranslations } from "@/i18n";
import fetchApi from "@/services/api";
import type { Photo } from "@/types/photos";

export default function Photos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [seeFullMap, setSeeFullMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePhoto, setHasMorePhoto] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const currentFetchingPage = useRef(0);
  const { translate } = useTranslations();

  useEffect(() => {
    if (currentFetchingPage.current === currentPage) {
      return;
    }

    currentFetchingPage.current = currentPage;

    setIsLoading(true);

    fetchApi(`/get-photos?limit=20&page=${currentPage}`)
      .then(async (response) => {
        const newPhotos = await response.json();

        setPhotos((prev) => [...prev, ...newPhotos.data]);
        setHasMorePhoto(newPhotos.pagination.has_next);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage]);

  return (
    <div className="photo-screen">
      <h2>{translate("photos.title")}</h2>
      <Text component="p">{translate("photos.description")}</Text>

      {import.meta.env.DEV && (
        <div>
          <p>
            <label>
              <input
                type="checkbox"
                name="see-full-map"
                checked={seeFullMap}
                onChange={() => {
                  setSeeFullMap((prev) => !prev);
                }}
              />
              See full map
            </label>
          </p>
        </div>
      )}

      {seeFullMap && <div className="full-map"></div>}

      {photos.length > 0 && <PhotoList photos={photos} />}

      {!isLoading && hasMorePhoto && (
        <Button
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          {translate("more.label")}
        </Button>
      )}

      {isLoading && <Loader />}
    </div>
  );
}
