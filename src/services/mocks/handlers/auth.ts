import { IS_ANONYMOUS } from "../config";
import { db } from "../db";
import { jsonResponse } from "../helpers";
import { anonymousUser } from "../fixtures/users";
import type { MockHandlers } from "../types";

const authHandlers: MockHandlers = {
  "GET /me": () => jsonResponse(IS_ANONYMOUS ? anonymousUser : db.user),

  // Real OAuth cannot complete offline, so these are only reachable if a
  // future dev-only "mock login" shortcut is added. They always log in.
  "POST /auth-google": () => jsonResponse(db.user),
  "POST /auth-discord": () => jsonResponse(db.user),

  "POST /refresh-token": () => jsonResponse(db.user),
};

export default authHandlers;
