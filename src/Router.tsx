import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import AccountLayout from "@/layouts/sublayouts/AccountLayout";
import MainLayout from "@/layouts/MainLayout";

import AccountNotifications from "@/screens/Account/Notifications";
import AccountPhotos from "@/screens/Account/Photos";
import AccountAlbums from "@/screens/Account/Albums";
import AccountAlbumId from "@/screens/Account/Albums/ID";
import AccountPreferences from "@/screens/Account/Preferences";
import AlbumId from "@/screens/Albums/ID";
import ErrorBoundary from "@/screens/Error";
import LogoutWarning from "@/screens/Error/LogoutWarning";
import { SurvivalGame, GoalGame, DailyGame, ChronoGame } from "@/screens/Game";
import Home from "@/screens/Home";
import Leaderboards from "@/screens/Leaderboards";
import Login from "@/screens/Login";
import Photos from "@/screens/Photos";
import Play from "@/screens/Play";
import PrivacyPolicies from "@/screens/PrivacyPolicies";
import Upload from "@/screens/Upload";
import UploadHelp from "@/screens/UploadHelp";
import ReleaseNotes from "@/screens/ReleaseNotes";
import TermsServices from "@/screens/TermsServices";
import fetchApi from "@/services/api";

import type { Photo } from "@/types/photos";

const getReponseJsonGetter =
  (errorMessage: string) => async (response: Response) => {
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return response.json();
  };

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
        { index: true, Component: Home },
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
          Component: AccountAlbumId,
          loader: async ({ params }) => {
            const getReponseJson = getReponseJsonGetter(
              `Cannot fetch album ${params.id}`
            );

            const responses = await Promise.all([
              fetchApi(`/album?id=${params.id}`, "GET").then(getReponseJson),
              fetchApi("/my-photos", "GET")
                .then(getReponseJson)
                .then((photos: Photo[]) =>
                  photos.filter((photo) => Boolean(photo.validatedAt))
                ),
            ]);

            return {
              album: responses[0],
              availablePhotos: responses[1],
            };
          },
        },
        {
          path: "/albums/:id",
          Component: AlbumId,
          loader: async ({ params }) => {
            const getReponseJson = async (response: Response) => {
              if (!response.ok) {
                throw new Error(`Cannot fetch album ${params.id}`);
              }
              return response.json();
            };

            const album = await fetchApi(`/album?id=${params.id}`, "GET").then(
              getReponseJson
            );

            return { album };
          },
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
              Component: AccountPreferences,
            },
            {
              path: "/account/notifications",
              Component: AccountNotifications,
            },
            {
              path: "/account/photos",
              Component: AccountPhotos,
            },
            {
              path: "/account/albums",
              Component: AccountAlbums,
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
                          .length
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
              path: ":mode",
              children: [
                {
                  index: true,
                  element: <Navigate to="150cc" replace />,
                },
                {
                  path: ":difficulty",
                  Component: Leaderboards,
                },
              ],
            },
          ],
        },
        {
          path: "/login",
          Component: Login,
        },
        {
          path: "/photos",
          Component: Photos,
        },
        {
          path: "/play",
          Component: Play,
        },
        {
          path: "/privacypolicies",
          Component: PrivacyPolicies,
        },
        {
          path: "/releasenotes",
          Component: ReleaseNotes,
        },
        {
          path: "/dailygame",
          Component: DailyGame,
        },
        {
          path: "/goalgame",
          Component: GoalGame,
        },
        {
          path: "/chronogame",
          Component: ChronoGame,
        },
        {
          path: "/survivalgame",
          Component: SurvivalGame,
        },
        {
          path: "/termsservices",
          Component: TermsServices,
        },
        {
          path: "/upload",
          Component: Upload,
        },
        {
          path: "/uploadhelp",
          Component: UploadHelp,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL || "/" }
);

export default function Router() {
  return <RouterProvider router={router} />;
}
