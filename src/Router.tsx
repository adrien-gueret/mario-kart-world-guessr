import type { ComponentType } from "react";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import AccountLayout from "@/layouts/sublayouts/AccountLayout";
import AlbumLayout from "@/layouts/sublayouts/AlbumLayout";
import GalleryLayout from "@/layouts/sublayouts/GalleryLayout";
import MainLayout from "@/layouts/MainLayout";

import ErrorBoundary from "@/screens/Error";
import LogoutWarning from "@/screens/Error/LogoutWarning";
import fetchApi from "@/services/api";

import type { Photo } from "@/types/photos";

const getReponseJsonGetter =
  (errorMessage: string) => async (response: Response) => {
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return response.json();
  };

const loadComponent = (importPath: Promise<{ default: ComponentType }>) =>
  importPath.then((m) => ({ Component: m.default }));

const router = createBrowserRouter(
  [
    {
      Component: LogoutWarning,
      path: "/logout-warning",
    },
    {
      element: <MainLayout shouldHideHomeButton logoVariant="big" />,
      ErrorBoundary,
      children: [
        {
          index: true,
          lazy: () => loadComponent(import("@/screens/Home")),
        },
        {
          path: "/home",
          element: <Navigate to="/" replace />,
        },
      ],
    },
    {
      element: <MainLayout logoVariant="corner" enableLoader />,
      ErrorBoundary,
      children: [
        {
          path: "/account/albums/:id",
          lazy: () => loadComponent(import("@/screens/Account/Albums/ID")),
          loader: async ({ params }) => {
            const getReponseJson = getReponseJsonGetter(
              `Cannot fetch album ${params.id}`,
            );

            const response = await fetchApi(
              `/album?id=${params.id}`,
              "GET",
            ).then(getReponseJson);
            return {
              album: response,
            };
          },
        },
        {
          path: "/albums/:id",
          Component: AlbumLayout,
          loader: async ({ params }) => {
            const getReponseJson = async (response: Response) => {
              if (!response.ok) {
                throw new Error(`Cannot fetch album ${params.id}`);
              }
              return response.json();
            };

            const album = await fetchApi(`/album?id=${params.id}`, "GET").then(
              getReponseJson,
            );

            return { album };
          },
          children: [
            {
              index: true,
              lazy: () => loadComponent(import("@/screens/Albums/ID/Photos")),
            },
            {
              path: "leaderboard",
              lazy: () =>
                loadComponent(import("@/screens/Albums/ID/Leaderboard")),
              loader: async ({ params }) => {
                const getReponseJson = getReponseJsonGetter(
                  `Cannot fetch album ${params.id} leaderboard`,
                );

                const leaderboard = await fetchApi(
                  `/leaderboards?mode=album&albumId=${params.id}`,
                  "GET",
                ).then(getReponseJson);

                return { leaderboard };
              },
            },
          ],
        },
      ],
    },
    {
      Component: MainLayout,
      ErrorBoundary,
      children: [
        {
          path: "/account",
          Component: AccountLayout,
          children: [
            {
              index: true,
              element: <Navigate to="/account/preferences" replace />,
            },
            {
              path: "/account/preferences",
              lazy: () =>
                loadComponent(import("@/screens/Account/Preferences")),
            },
            {
              path: "/account/notifications",
              lazy: () =>
                loadComponent(import("@/screens/Account/Notifications")),
            },
            {
              path: "/account/photos",
              lazy: () => loadComponent(import("@/screens/Account/Photos")),
            },
            {
              path: "/account/albums",
              lazy: () => loadComponent(import("@/screens/Account/Albums")),
              loader: async () => {
                const getReponseJson =
                  getReponseJsonGetter(`Cannot fetch albums`);

                const responses = await Promise.all([
                  fetchApi("/my-albums", "GET").then(getReponseJson),
                  fetchApi("/my-photos", "GET")
                    .then(getReponseJson)
                    .then(
                      (photos: Photo[]) =>
                        photos.filter((photo) => Boolean(photo.validatedAt))
                          .length,
                    ),
                ]);

                return {
                  albums: responses[0],
                  canCreateAlbum: responses[1] > 0,
                };
              },
            },
          ],
        },
        {
          path: "/leaderboards",
          children: [
            {
              index: true,
              element: <Navigate to="survival/150cc" replace />,
            },
            {
              path: ":mode/:gameDifficulty?",
              lazy: () => loadComponent(import("@/screens/Leaderboards")),
            },
          ],
        },
        {
          path: "/login",
          lazy: () => loadComponent(import("@/screens/Login")),
        },
        {
          path: "/gallery",
          Component: GalleryLayout,
          children: [
            {
              index: true,
              element: <Navigate to="/gallery/photos" replace />,
            },
            {
              path: "/gallery/photos",
              lazy: () => loadComponent(import("@/screens/Gallery/AllPhotos")),
            },
            {
              path: "/gallery/albums",
              lazy: () =>
                loadComponent(import("@/screens/Gallery/CommunityAlbums")),
              loader: async () => {
                const getReponseJson = getReponseJsonGetter(
                  `Cannot fetch public albums`,
                );

                const albums = await fetchApi("/public-albums", "GET").then(
                  getReponseJson,
                );

                return { albums };
              },
            },
          ],
        },
        {
          path: "/photos",
          lazy: () => loadComponent(import("@/screens/Photos")),
        },
        {
          path: "/play",
          lazy: () => loadComponent(import("@/screens/Play")),
        },
        {
          path: "/privacypolicies",
          lazy: () => loadComponent(import("@/screens/PrivacyPolicies")),
        },
        {
          path: "/releasenotes",
          lazy: () => loadComponent(import("@/screens/ReleaseNotes")),
        },
        {
          path: "/dailygame",
          lazy: () =>
            import("@/screens/Game").then((m) => ({ Component: m.DailyGame })),
        },
        {
          path: "/goalgame",
          lazy: () =>
            import("@/screens/Game").then((m) => ({ Component: m.GoalGame })),
        },
        {
          path: "/chronogame",
          lazy: () =>
            import("@/screens/Game").then((m) => ({ Component: m.ChronoGame })),
        },
        {
          path: "/survivalgame",
          lazy: () =>
            import("@/screens/Game").then((m) => ({
              Component: m.SurvivalGame,
            })),
        },
        {
          path: "/albumgame/:albumId",
          lazy: () =>
            import("@/screens/Game").then((m) => ({ Component: m.AlbumGame })),
        },
        {
          path: "/termsservices",
          lazy: () => loadComponent(import("@/screens/TermsServices")),
        },
        {
          path: "/upload",
          lazy: () => loadComponent(import("@/screens/Upload")),
        },
        {
          path: "/uploadhelp",
          lazy: () => loadComponent(import("@/screens/UploadHelp")),
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL || "/" },
);

export default function Router() {
  return <RouterProvider router={router} />;
}
