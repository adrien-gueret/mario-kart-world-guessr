import type { Album, Photo } from "@/types/photos";
import type { Difficulty, GameHistory, GameMode } from "@/types/game";
import type { Notification } from "@/notifications/types";
import type { User } from "@/types/user";

import { loggedUser } from "./fixtures/users";
import { photos as photosFixture } from "./fixtures/photos";
import { myAlbums, publicAlbums } from "./fixtures/albums";
import { notifications as notificationsFixture } from "./fixtures/notifications";

export type GameState = {
  id: number;
  mode: GameMode;
  difficulty: Difficulty | null;
  photoIds: string[];
  index: number;
  history: GameHistory;
  totalScore: number;
  remainingTime: number | null;
  finished: boolean;
};

type Database = {
  user: User;
  photos: Photo[];
  myAlbums: Album[];
  publicAlbums: Album[];
  notifications: Notification[];
  games: Map<number, GameState>;
  counters: {
    album: number;
    game: number;
    notification: number;
  };
};

/** Deep clone so runtime mutations never leak back into the fixtures. */
function clone<T>(value: T): T {
  return structuredClone(value);
}

/**
 * Mutable, in-memory database seeded from the fixtures. It is reset on every
 * page reload, which keeps the mock layer simple and predictable.
 */
export const db: Database = {
  user: clone(loggedUser),
  photos: clone(photosFixture),
  myAlbums: clone(myAlbums),
  publicAlbums: clone(publicAlbums),
  notifications: clone(notificationsFixture),
  games: new Map(),
  counters: {
    album: 1000,
    game: 5000,
    notification: 100,
  },
};
