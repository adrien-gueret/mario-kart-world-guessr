import { useCurrentUser } from "@/auth/CurrentUserProvider";
import type { Album } from "@/types/photos";

import "./Album.css";
import AlbumEdit from "./Edit";
import AlbumReadOnly from "./ReadOnly";

type Props = Album & {
  isEditing?: boolean;
};

export default function Album({ isEditing = false, ...album }: Props) {
  const { user } = useCurrentUser();

  return isEditing ? (
    <AlbumEdit {...album} />
  ) : (
    <AlbumReadOnly
      {...album}
      isCurrentUserTheAuthor={user?.id === album.author.id}
    />
  );
}
