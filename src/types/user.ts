export type User = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
  marioCharacter: "mario" | "luigi" | "peach" | "bowser" | null;
  locale: "fr" | "en" | null;
};
