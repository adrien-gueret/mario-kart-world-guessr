import type { AlbumPhoto } from "@/types/photos";

const photoPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function getPositionedAlbumPhotos(
  photos: Array<AlbumPhoto>
): Array<{
  position: number;
  photo: AlbumPhoto | undefined;
}> {
  return photoPositions.map((position) => ({
    position,
    photo: photos.find((p) => p.position === position),
  }));
}
