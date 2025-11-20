import { useState, useEffect } from "react";
import { useTranslations } from "@/i18n";

import AlbumList from "@/components/AlbumList";
import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import Surface from "@/components/Surface";

import fetchApi from "@/services/api";

import type { Album } from "@/types/photos";

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { translate } = useTranslations();

  useEffect(() => {
    async function fetchAlbums() {
      setIsLoading(true);

      const response = await fetchApi("/my-albums");
      const albums = await response.json();

      setAlbums(albums);
      setIsLoading(false);
    }

    fetchAlbums();
  }, []);

  return (
    <>
      <ConstraintContainer>
        <Surface>
          <p>{translate("account.albums.description")}</p>
        </Surface>
      </ConstraintContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <AlbumList
          albums={albums}
          getAlbumURL={(albumId) => `/account/albums/${albumId}`}
          canCreateNewAlbum
        />
      )}
    </>
  );
}
