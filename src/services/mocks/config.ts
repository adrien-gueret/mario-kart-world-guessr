/**
 * Runtime configuration for the mock layer, driven by Vite env variables.
 *
 * - `dev:mock`      -> logged-in mock user
 * - `dev:mock:anon` -> anonymous visitor (VITE_MOCK_ANONYMOUS=true)
 */
export const IS_ANONYMOUS = import.meta.env.VITE_MOCK_ANONYMOUS === "true";

/** Artificial latency (ms) applied to every mocked response. */
export const MOCK_LATENCY_MS = 150;
