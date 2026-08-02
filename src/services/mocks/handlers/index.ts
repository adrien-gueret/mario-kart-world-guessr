import type { MockHandlers } from "../types";

import authHandlers from "./auth";
import userHandlers from "./user";
import photoHandlers from "./photos";
import gameHandlers from "./game";
import leaderboardHandlers from "./leaderboards";
import notificationHandlers from "./notifications";
import albumHandlers from "./albums";
import miscHandlers from "./misc";

export const handlers: MockHandlers = {
  ...authHandlers,
  ...userHandlers,
  ...photoHandlers,
  ...gameHandlers,
  ...leaderboardHandlers,
  ...notificationHandlers,
  ...albumHandlers,
  ...miscHandlers,
};
