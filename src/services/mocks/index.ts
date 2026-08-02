import { handlers } from "./handlers";
import { notFound } from "./helpers";
import type { MockContext } from "./types";

/**
 * Local mock router. Enabled via `VITE_USE_MOCKS=true` (see `npm run dev:mock`).
 * Every `fetchApi` call is routed here instead of hitting the production API,
 * so the app runs fully offline. Routes are matched on `METHOD pathname`.
 */
export async function resolveMock(
  path: string,
  method: string,
  body?: FormData,
): Promise<Response> {
  const [rawPath, queryString = ""] = path.split("?");
  const pathname = rawPath.replace(/\.php$/, "");
  const query = new URLSearchParams(queryString);

  const key = `${method} ${pathname}`;
  const handler = handlers[key];

  if (!handler) {
    console.warn(`[mocks] No handler registered for "${key}"`);
    return notFound(key);
  }

  const context: MockContext = { query, body, method, pathname };
  return handler(context);
}
