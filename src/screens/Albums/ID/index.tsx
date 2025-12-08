import { useLoaderData } from "react-router-dom";

import AlbumComponent from "@/components/Album";

import type { Album } from "@/types/photos";

export default function AlbumId() {
  const { album } = useLoaderData<{
    album: Album;
  }>();

  return <AlbumComponent {...album} />;
}
