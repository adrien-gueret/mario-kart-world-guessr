import { getKey, storeKey } from "./store";

const ROOT_URL = "https://www.mariouniversalis.fr/mario-kart-world-guessr/api";

function getHeaders({
  accessToken,
  acceptLanguage,
}: {
  accessToken?: string;
  acceptLanguage?: "fr" | "en";
}): Headers {
  const headers = new Headers();

  const authorizationHeader = [];

  if (import.meta.env.DEV) {
    authorizationHeader.push(import.meta.env.VITE_AUTHORIZATION_TOKEN);
  }

  if (accessToken) {
    authorizationHeader.push(accessToken);
  }

  if (authorizationHeader.length > 0) {
    headers.append("Authorization", `Bearer ${authorizationHeader.join(" ")}`);
  }

  if (acceptLanguage) {
    headers.append("Accept-Language", acceptLanguage);
  }

  return headers;
}

export default async function fetchApi(
  path: `/${string}`,
  method: "GET" | "POST" = "GET",
  body?: FormData,
  acceptLanguage?: "fr" | "en"
): Promise<Response> {
  const currentUser = getKey("currentUser");
  let headers = getHeaders({
    accessToken: currentUser?.accessToken ?? undefined,
    acceptLanguage,
  });

  if (
    currentUser?.accessToken &&
    currentUser?.expiredAt &&
    new Date(currentUser.expiredAt) <= new Date(Date.now() + 5 * 60 * 1000)
  ) {
    try {
      const refreshFormData = new FormData();
      refreshFormData.append("refreshToken", currentUser.refreshToken);

      const refreshReponse = await fetch(`${ROOT_URL}/refresh-token`, {
        method: "POST",
        body: refreshFormData,
        headers,
        mode: "cors",
      });

      const newUser = await refreshReponse.json();
      storeKey("currentUser", newUser);

      headers = getHeaders({
        accessToken: newUser.accessToken,
        acceptLanguage,
      });
    } catch (e) {
      storeKey("currentUser", null);
    }
  }

  return fetch(`${ROOT_URL}${path}`, {
    method,
    body,
    headers,
    credentials: "include",
    mode: "cors",
  });
}
