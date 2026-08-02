import type { MarioCharacter } from "@/characters";

import { db } from "../db";
import { field, jsonResponse, okResponse } from "../helpers";
import type { MockHandlers } from "../types";

const photoHandlers: MockHandlers = {
  "GET /my-photos": () => jsonResponse(db.photos),

  "GET /get-photos": () => jsonResponse(db.photos),

  // Only `response.ok` is checked client-side; nothing to parse.
  "POST /upload-photo": () => okResponse(),

  "POST /update-photo-characters": ({ body }) => {
    const photoId = field(body, "photoId");
    const characters = (body?.getAll("characters[]") ?? []).map(
      String,
    ) as MarioCharacter[];

    const photo = db.photos.find((p) => p.id === photoId);
    if (photo) {
      photo.characters = characters;
    }

    return jsonResponse({ success: true, characters });
  },

  "GET /get-guesses": ({ query }) => {
    const photoId = query.get("id");
    const photo = db.photos.find((p) => p.id === photoId);
    const x = photo?.x ?? 1500;
    const y = photo?.y ?? 1500;

    const guesses = [
      { id: 1, x, y, isAnswer: 1 as const },
      { id: 2, x: x + 120, y: y - 80, isAnswer: 0 as const },
      { id: 3, x: x - 200, y: y + 150, isAnswer: 0 as const },
      { id: 4, x: x + 340, y: y + 60, isAnswer: 0 as const },
    ];

    return jsonResponse(guesses);
  },
};

export default photoHandlers;
