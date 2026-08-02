import { jsonResponse } from "../helpers";
import { db } from "../db";
import { leaderboards, botLeaderboards } from "../fixtures/leaderboards";
import { dailies } from "../fixtures/dailies";
import type { MockHandlers } from "../types";

const leaderboardHandlers: MockHandlers = {
  "GET /leaderboards": () => jsonResponse(leaderboards),

  "GET /my-dailies": () => jsonResponse(db.user.email ? dailies : []),

  "GET /next-daily": () => {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return jsonResponse({ nextDailyDate: tomorrow.toISOString() });
  },

  "GET /relative-leaderboards": ({ query }) =>
    jsonResponse(
      query.get("only-bots") === "1" ? botLeaderboards : leaderboards,
    ),
};

export default leaderboardHandlers;
