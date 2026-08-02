import { okResponse } from "../helpers";
import type { MockHandlers } from "../types";

const miscHandlers: MockHandlers = {
  // Fire-and-forget error reporting; nothing is parsed client-side.
  "POST /track-error": () => okResponse(204),
};

export default miscHandlers;
