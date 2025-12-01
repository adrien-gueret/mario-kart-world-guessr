import { useState, useEffect } from "react";
import useNavigate from "@/services/useNavigate";
import { useTranslations } from "@/i18n";

import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import PhotoListContainer from "@/components/PhotoListContainer";
import Surface from "@/components/Surface";

import fetchApi from "@/services/api";

import type { Photo } from "@/types/photos";
import Button from "@/components/Button";

import "./Photos.css";

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { translate } = useTranslations();
  const navigate = useNavigate();

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

  const photoCount = photos.length;

  return (
    <>
      <ConstraintContainer>
        <Surface>
          <p>{translate("account.photos.description")}</p>
        </Surface>

        <div className="account-photos-upload-button">
          <Button onClick={() => navigate("/upload")} variant="primary">
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

            <PhotoListContainer
              photos={photos}
              suggestionLabelKey="account.photos.stats.suggestions"
            />
          </>
        )
      )}
    </>
  );
}
