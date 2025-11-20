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

export type AlbumPhoto = Omit<
  Photo,
  "suggestionCount" | "x" | "y" | "validatedAt"
>;

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
