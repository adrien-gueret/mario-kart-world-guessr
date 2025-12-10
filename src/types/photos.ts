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

export type AlbumBackgroundImage =
  | "debris"
  | "squares"
  | "wood"
  | "stickers"
  | "food"
  | "checkerboard"
  | "dots"
  | "waves"
  | "tires";

export type Album = {
  id: number;
  name: string;
  coverUrl: string;
  isPublished: boolean;
  createdAt: string;
  backgroundImage: AlbumBackgroundImage;
  backgroundColor: string;
  author: {
    id: number;
    name: string;
    character: MarioCharacter | null;
  };
  photos: AlbumPhoto[];
};
