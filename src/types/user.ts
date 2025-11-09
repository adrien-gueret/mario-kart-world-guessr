import type { MarioCharacter } from "@/types/characters";

export type User = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
  marioCharacter: MarioCharacter | null;
  locale: "fr" | "en" | null;
  distanceUnit: "km" | "miles" | null;
};
