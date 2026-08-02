import type { UsableMarioCharacter } from "@/characters";

import { db } from "../db";
import { field, jsonResponse } from "../helpers";
import { characters } from "../fixtures/characters";
import type { MockHandlers } from "../types";

const userHandlers: MockHandlers = {
  "PUT /update-user": ({ body }) => {
    const username = field(body, "username");
    const locale = field(body, "locale") as "fr" | "en" | undefined;
    const distanceUnit = field(body, "distanceUnit") as
      | "km"
      | "miles"
      | undefined;
    const marioCharacter = field(body, "marioCharacter") as
      | UsableMarioCharacter
      | undefined;

    if (username !== undefined) db.user.username = username;
    if (locale !== undefined) db.user.locale = locale;
    if (distanceUnit !== undefined) db.user.distanceUnit = distanceUnit;
    if (marioCharacter !== undefined) db.user.marioCharacter = marioCharacter;

    return jsonResponse({ user: db.user });
  },

  "GET /characters": () => jsonResponse(characters),
};

export default userHandlers;
