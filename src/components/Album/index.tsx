import { useCurrentUser } from "@/auth/CurrentUserProvider";
import type { Album, Photo } from "@/types/photos";

import "./Album.css";
import AlbumEdit from "./Edit";
import AlbumReadOnly from "./ReadOnly";

type Props = Album & {
  isEditing?: boolean;
  availablePhotos?: Photo[];
};

export default function Album({
  isEditing = false,
  availablePhotos = [],
  ...album
}: Props) {
  const { user } = useCurrentUser();

  return isEditing ? (
    <AlbumEdit {...album} availablePhotos={availablePhotos} />
  ) : (
    <AlbumReadOnly
      {...album}
      isCurrentUserTheAuthor={user?.id === album.author.id}
    />
  );
}
