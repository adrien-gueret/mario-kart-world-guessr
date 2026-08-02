import type { Achievement } from "@/types/achievements";

import { MOCK_LATENCY_MS } from "./config";

type JsonResponseInit = {
  status?: number;
  achievements?: Achievement[];
  headers?: Record<string, string>;
};

/** Simulate network latency so loading states behave like production. */
export function delay(ms: number = MOCK_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Build a JSON `Response`, optionally carrying achievement-unlock headers. */
export async function jsonResponse(
  data: unknown,
  init: JsonResponseInit = {},
): Promise<Response> {
  await delay();

  const headers = new Headers({
    "Content-Type": "application/json",
    ...init.headers,
  });

  if (init.achievements?.length) {
    headers.set(
      "Mario-Kart-World-Unlock-Achievement",
      init.achievements.join(","),
    );
  }

  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers,
  });
}

/** Empty successful response (e.g. fire-and-forget or `response.ok` checks). */
export async function okResponse(status: number = 200): Promise<Response> {
  await delay();
  return new Response(null, { status });
}

/** Fallback response when no handler matches the requested route. */
export function notFound(key: string): Response {
  return new Response(
    JSON.stringify({ error: true, message: `Mock not found: ${key}` }),
    { status: 404, headers: { "Content-Type": "application/json" } },
  );
}

/** Read a FormData field as a trimmed string, or `undefined` when absent. */
export function field(
  body: FormData | undefined,
  name: string,
): string | undefined {
  const value = body?.get(name);
  return typeof value === "string" ? value : undefined;
}
