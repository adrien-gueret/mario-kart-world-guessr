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
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: FormData
): Promise<Response> {
  const documentLang = document.documentElement.lang;
  const currentUser = getKey("currentUser");
  const acceptLanguage =
    documentLang === "fr" || documentLang === "en"
      ? documentLang
      : currentUser?.locale ?? "en";
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

      const refreshResponse = await fetch(`${ROOT_URL}/refresh-token`, {
        method: "POST",
        body: refreshFormData,
        headers,
        mode: "cors",
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh token");
      }

      const newUser = await refreshResponse.json();

      if (newUser?.error) {
        throw new Error(newUser.message || "Failed to refresh token");
      }

      storeKey("currentUser", newUser);

      headers = getHeaders({
        accessToken: newUser.accessToken,
        acceptLanguage,
      });
    } catch (e) {
      storeKey("currentUser", null);
      window.location.hash = "#/logout-warning";
    }
  }

  const response = await fetch(`${ROOT_URL}${path}`, {
    method,
    body,
    headers,
    credentials: "include",
    mode: "cors",
  });

  response.headers
    .get("Mario-Kart-World-Unlock-Achievement")
    ?.split(",")
    .forEach((achievement) => {
      const achievementEvent = new CustomEvent("achievementUnlocked", {
        detail: {
          achievementId: achievement.trim(),
        },
      });
      window.dispatchEvent(achievementEvent);
    });

  return response;
}
