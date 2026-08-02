import type { User } from "@/types/user";

/** Full account used when running `dev:mock`. `expiredAt` is far in the future
 * so the token-refresh path is never triggered. */
export const loggedUser: User = {
  id: 1,
  username: "MockPlayer",
  email: "mock@example.com",
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  expiredAt: "2099-12-31T23:59:59.000Z",
  marioCharacter: "mario",
  locale: "fr",
  distanceUnit: "km",
  withSafeArea: false,
};

/** Anonymous visitor used when running `dev:mock:anon`. The app treats a user
 * as anonymous when `email` is falsy (see CurrentUserProvider). */
export const anonymousUser: User = {
  id: 0,
  username: "",
  email: "",
  accessToken: "",
  refreshToken: "",
  expiredAt: "",
  marioCharacter: null,
  locale: null,
  distanceUnit: null,
  withSafeArea: false,
};
