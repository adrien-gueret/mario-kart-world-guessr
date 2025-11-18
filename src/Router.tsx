import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Account from "@/screens/Account";
import AccountNotifications from "@/screens/Account/Notifications/screen";
import AccountPhotos from "@/screens/Account/Photos/screen";
import AccountAlbums from "@/screens/Account/Albums/screen";
import AccountAlbumId from "@/screens/Account/Albums/ID";
import AccountPreferences from "@/screens/Account/Preferences/screen";
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
        element: <Navigate to="/" />,
      },
      {
        path: "/account",
        Component: Account,
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
      {
        path: "/account/preferences",
        Component: AccountPreferences,
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
        Component: Leaderboards,
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
