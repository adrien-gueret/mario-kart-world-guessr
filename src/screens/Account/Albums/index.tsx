import { useLoaderData } from "react-router-dom";
import { useTranslations } from "@/i18n";

import AlbumList from "@/components/AlbumList";
import Button from "@/components/Button";
import ConstraintContainer from "@/components/ConstraintContainer";
import Text from "@/components/Text";
import Surface from "@/components/Surface";
import useNavigate from "@/services/useNavigate";
import type { Album } from "@/types/photos";

export default function Albums() {
  const { albums, canCreateAlbum } = useLoaderData<{
    albums: Album[];
    canCreateAlbum: boolean;
  }>();

  const { translate } = useTranslations();
  const navigate = useNavigate();

  const addPhotoButton = (
    <div className="account-photos-upload-button">
      <Button onClick={() => navigate("/upload")} variant="primary">
        {translate("upload.title")}
      </Button>
    </div>
  );

  return (
    <>
      <ConstraintContainer>
        <Surface>
          <p>{translate("account.albums.description")}</p>
        </Surface>
      </ConstraintContainer>

      {canCreateAlbum ? (
        <AlbumList
          albums={albums}
          getAlbumURL={(albumId) => `/account/albums/${albumId}`}
          canCreateNewAlbum
        />
      ) : (
        <div style={{ marginTop: 64 }}>
          <ConstraintContainer>
            <Text>{translate("account.albums.photo.select.description")}</Text>
            <Text>{translate("account.albums.no_photos")}</Text>

            {addPhotoButton}
          </ConstraintContainer>
        </div>
      )}
    </>
  );
}
