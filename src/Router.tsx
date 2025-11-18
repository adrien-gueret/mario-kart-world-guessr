import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";

import AccountLayout from "@/layouts/AccountLayout";
import MainLayout from "@/layouts/MainLayout";

import AccountNotifications from "@/screens/Account/Notifications";
import AccountPhotos from "@/screens/Account/Photos";
import AccountAlbums from "@/screens/Account/Albums";
import AccountAlbumId from "@/screens/Account/Albums/ID";
import AccountPreferences from "@/screens/Account/Preferences";
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

const router = createHashRouter([
  {
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "/home",
        element: <Navigate to="/" replace />,
      },
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
          },
          {
            path: "/account/albums/:id",
            Component: AccountAlbumId,
          },
        ],
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
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
