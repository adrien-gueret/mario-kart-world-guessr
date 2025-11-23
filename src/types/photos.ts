import type { MarioCharacter } from "./characters";
import type { Coordinates } from "./location";

export type Photo = {
  id: string;
  difficulty: "easy" | "medium" | "hard" | null;
  validatedAt: string | null;
  photoUrl: string;
  suggestionCount: number;
} & Coordinates;

export type PhotoFilter = NonNullable<Photo["difficulty"]> | "all";

export type AlbumPhoto = Pick<Photo, "id" | "difficulty" | "photoUrl"> & {
  position: number;
};

export type Album = {
  id: number;
  name: string;
  isPublished: boolean;
  createdAt: string;
  author: {
    id: number;
    name: string;
    character: MarioCharacter | null;
  };
  photos: AlbumPhoto[];
};
