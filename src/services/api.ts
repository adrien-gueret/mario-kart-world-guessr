export default function fetchApi(
  path: `/${string}`,
  method: "GET" | "POST" = "GET",
  body?: FormData
): Promise<Response> {
  const headers = new Headers();

  if (import.meta.env.DEV) {
    headers.append(
      "Authorization",
      `Bearer ${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
    );
  }

  return fetch(
    `https://www.mariouniversalis.fr/mario-kart-world-guessr/api${path}`,
    {
      method,
      body,
      headers,
    }
  );
}
