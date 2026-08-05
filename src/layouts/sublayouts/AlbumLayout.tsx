import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router-dom";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import AlbumPublicationCallout from "@/components/AlbumPublicationCallout";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Tabs from "@/components/Tabs";

import { useTranslations } from "@/i18n";

import useNavigate from "@/services/useNavigate";

import type { Album } from "@/types/photos";

import "./AlbumLayout.css";

export type AlbumOutletContext = {
  album: Album;
  isCurrentUserTheAuthor: boolean;
};

export default function AlbumLayout() {
  const { album } = useLoaderData<{ album: Album }>();
  const { user } = useCurrentUser();
  const { translate } = useTranslations();
  const { state } = useNavigation();
  const navigate = useNavigate();

  const activeTab = useLocation().pathname.replace(/\/$/, "");

  const isCurrentUserTheAuthor = user?.id === album.author.id;

  const baseUrl = `/albums/${album.id}`;
  const isOnLeaderboardTab = activeTab === `${baseUrl}/leaderboard`;
  const canPlay =
    album.photos.length > 0 && (album.isPublished || isCurrentUserTheAuthor);

  return (
    <div className="album-layout">
      <img className="album-layout__cover" src={album.coverUrl} alt="" />

      <p className="album-layout__name">{album.name}</p>

      <p className="album-layout__author">
        <span>
          {translate("album.by")} <b>{album.author.name}</b>
        </span>
        {album.author.character && (
          <img
            style={{ width: "32px", verticalAlign: "text-bottom" }}
            src={`./ui/pins/icon-${album.author.character}.png`}
            alt=""
          />
        )}
      </p>

      {isCurrentUserTheAuthor && (
        <AlbumPublicationCallout
          albumId={album.id}
          albumName={album.name}
          isPublished={album.isPublished}
          hideShowButton
        />
      )}

      <div className="album-layout__tabs">
        <Tabs
          activeTab={activeTab}
          tabs={[
            {
              children: translate("album.tab.photos"),
              value: baseUrl,
              to: baseUrl,
              preventScrollReset: true,
            },
            {
              children: translate("album.tab.leaderboard"),
              value: `${baseUrl}/leaderboard`,
              to: `${baseUrl}/leaderboard`,
              preventScrollReset: true,
            },
          ]}
          tabComponent={Link}
          variant="chips"
        />
      </div>

      {state === "loading" ? (
        <Loader />
      ) : (
        <Outlet
          context={
            { album, isCurrentUserTheAuthor } satisfies AlbumOutletContext
          }
        />
      )}

      <div className="album-layout__actions">
        <Button variant="tertiary" onClick={() => navigate("/gallery/albums")}>
          {translate("gallery.tab.albums")}
        </Button>

        <Button variant="secondary" onClick={() => navigate("/account/albums")}>
          {isCurrentUserTheAuthor
            ? translate("account.tab.albums")
            : translate("album.create.myOwn")}
        </Button>

        {canPlay && !(album.game?.hasPlayed && isOnLeaderboardTab) && (
          <Button
            onClick={() => {
              if (album.game?.hasPlayed) {
                navigate(`${baseUrl}/leaderboard`);
              } else {
                navigate(`/albumgame/${album.id}`);
              }
            }}
          >
            {album.game?.hasPlayed
              ? translate("album.play.seeScore")
              : translate("album.play.button")}
          </Button>
        )}
      </div>
    </div>
  );
}
