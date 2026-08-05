import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/auth/CurrentUserProvider";
import type { Album } from "@/types/photos";

import "./Album.css";
import AlbumEdit from "./Edit";

type Props = Album & {
  isEditing?: boolean;
};

export default function Album({ isEditing = false, ...album }: Props) {
  const { user } = useCurrentUser();
  const isCurrentUserTheAuthor = user?.id === album.author.id;

  if (!isEditing || !isCurrentUserTheAuthor) {
    return <Navigate to={"/albums/" + album.id} />;
  }

  return <AlbumEdit {...album} />;
}
