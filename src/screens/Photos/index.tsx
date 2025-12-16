import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Checkbox from "@/components/Checkbox";
import Loader from "@/components/Loader";
import PhotosMap from "@/components/PhotosMap";
import PhotoListContainer from "@/components/PhotoListContainer";
import Text from "@/components/Text";

import { useCurrentUser } from "@/auth/CurrentUserProvider";
import { useTranslations } from "@/i18n";
import fetchApi from "@/services/api";
import useRequiredAuth from "@/services/useRequiredAuth";
import type { Photo } from "@/types/photos";

export default function Photos() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showMap, setShowMap] = useState(false);
  const { translate } = useTranslations();

  const isAnonymous = useRequiredAuth();
  const { user } = useCurrentUser();
  const isAdmin = !isAnonymous && user?.id === 1;

  useEffect(() => {
    if (!isAdmin) {
      navigate("/nope", { replace: true });
      return;
    }

    setIsLoading(true);

    fetchApi(`/get-photos`)
      .then(async (response) => {
        const newPhotos = await response.json();

        setPhotos(newPhotos);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAdmin, user.id]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="photo-screen">
      <h2>{translate("photos.title")}</h2>
      <Text component="p">{translate("photos.description")}</Text>

      {photos.length > 0 && (
        <>
          <div style={{ marginTop: "32px" }}>
            <Checkbox
              name="show-map"
              label={translate("photos.showMap")}
              variant="default"
              checked={showMap}
              onChange={setShowMap}
            />
            {showMap && <PhotosMap photos={photos} />}
          </div>
          <PhotoListContainer
            photos={photos}
            canOpenDetailsOfNoValidatedPhotos
            canEditPhotoCharacters
          />
        </>
      )}

      {isLoading && <Loader />}
    </div>
  );
}
