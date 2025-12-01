import { useLoaderData } from "react-router-dom";
import { useTranslations } from "@/i18n";

import AlbumList from "@/components/AlbumList";
import ConstraintContainer from "@/components/ConstraintContainer";
import Surface from "@/components/Surface";

import type { Album } from "@/types/photos";

export default function Albums() {
  const albums = useLoaderData<Album[]>();

  const { translate } = useTranslations();

  return (
    <>
      <ConstraintContainer>
        <Surface>
          <p>{translate("account.albums.description")}</p>
        </Surface>
      </ConstraintContainer>

      <AlbumList
        albums={albums}
        getAlbumURL={(albumId) => `/account/albums/${albumId}`}
        canCreateNewAlbum
      />
    </>
  );
}
