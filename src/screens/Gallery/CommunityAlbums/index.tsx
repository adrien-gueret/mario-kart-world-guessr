import { useLoaderData } from "react-router-dom";

import AlbumList from "@/components/AlbumList";
import ConstraintContainer from "@/components/ConstraintContainer";
import Surface from "@/components/Surface";
import Text from "@/components/Text";
import { useTranslations } from "@/i18n";
import type { Album } from "@/types/photos";

export default function CommunityAlbums() {
  const { albums } = useLoaderData<{ albums: Album[] }>();

  const { translate } = useTranslations();

  return (
    <>
      <ConstraintContainer>
        <Surface>
          <p>{translate("gallery.community-albums.description")}</p>
        </Surface>
      </ConstraintContainer>

      {albums.length > 0 ? (
        <AlbumList
          albums={albums}
          getAlbumURL={(albumId) => `/albums/${albumId}`}
          showAuthor
        />
      ) : (
        <div style={{ marginTop: 64 }}>
          <ConstraintContainer>
            <Text>{translate("gallery.community-albums.empty")}</Text>
          </ConstraintContainer>
        </div>
      )}
    </>
  );
}
