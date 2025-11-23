import { useLoaderData } from "react-router-dom";

import AlbumComponent from "@/components/Album";

import type { Album, Photo } from "@/types/photos";

export default function AlbumId() {
  const { album, availablePhotos } = useLoaderData<{
    album: Album;
    availablePhotos: Photo[];
  }>();

  return (
    <AlbumComponent {...album} isEditing availablePhotos={availablePhotos} />
  );
}
