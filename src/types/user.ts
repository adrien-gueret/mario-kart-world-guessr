import type { UsableMarioCharacter } from "@/characters";

export type User = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
  marioCharacter: UsableMarioCharacter | null;
  locale: "fr" | "en" | null;
  distanceUnit: "km" | "miles" | null;
  withSafeArea: boolean;
};
