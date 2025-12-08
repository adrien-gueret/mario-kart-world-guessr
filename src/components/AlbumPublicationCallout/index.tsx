import { useState } from "react";
import { Link } from "react-router-dom";

import { useTranslations } from "@/i18n";

import EyeIcon from "../Icon/Eye";

import Callout from "../Callout";
import FormBase from "../FormBase";
import Icon from "../Icon";
import Snackbar from "../Snackbar";

import "./AlbumPublicationCallout.css";

type Props = {
  albumId: number;
  albumName: string;
  isPublished: boolean;
  hideShowButton?: boolean;
  hideEditButton?: boolean;
};

export default function AlbumPublicationCallout({
  albumId,
  albumName,
  isPublished,
  hideShowButton = false,
  hideEditButton = false,
}: Props) {
  const { translate } = useTranslations();
  const [isAlbumPublished, setIsAlbumPublished] = useState(isPublished);
  const [hasCopySuccess, setHasCopySuccess] = useState(false);

  const publicLink = `${window.location.origin}/mario-kart-world-guessr/albums/${albumId}`;

  const canShare = Boolean(navigator.share);

  const getTextToShare = () => {
    let textToShare = `${albumName}\n`;

    textToShare += `${translate(
      "share.album.description.myself"
    )}\n\n${publicLink}`;

    return textToShare;
  };

  const share = !canShare
    ? void 0
    : () => {
        navigator.share({
          text: getTextToShare(),
        });
      };

  const copy = async () => {
    await navigator.clipboard.writeText(publicLink);
    setHasCopySuccess(true);
  };

  return (
    <div className="album-publication-callout-container">
      <Snackbar
        type="success"
        isOpen={hasCopySuccess}
        onClose={() => {
          setHasCopySuccess(false);
        }}
      >
        {translate("share.copy.success")}
      </Snackbar>
      <Callout
        type={isAlbumPublished ? "success" : "warning"}
        action={
          <FormBase
            id="edit-album-publication"
            method="PATCH"
            action="/update-album-publication"
            successMessage={translate(
              isAlbumPublished
                ? "album.edit.unpublish.success"
                : "album.edit.publish.success"
            )}
            onSuccess={({ album }) => {
              setIsAlbumPublished(album.isPublished);
            }}
          >
            <input type="hidden" name="albumId" value={albumId} />
            <input
              type="hidden"
              name="isPublished"
              value={isAlbumPublished ? "0" : "1"}
            />
            <button type="submit" className="callout-action callout-reverse">
              <Icon>
                <path
                  d={
                    isAlbumPublished
                      ? "M21.19 21.19 2.81 2.81 1.39 4.22l2.27 2.27C2.61 8.07 2 9.96 2 12c0 5.52 4.48 10 10 10 2.04 0 3.93-.61 5.51-1.66l2.27 2.27zm-10.6-4.59-4.24-4.24 1.41-1.41 2.83 2.83.18-.18 1.41 1.41zm3-5.84-7.1-7.1C8.07 2.61 9.96 2 12 2c5.52 0 10 4.48 10 10 0 2.04-.61 3.93-1.66 5.51L15 12.17l2.65-2.65-1.41-1.41z"
                      : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z"
                  }
                />
              </Icon>
              {translate(
                isAlbumPublished ? "album.edit.unpublish" : "album.edit.publish"
              )}
            </button>
          </FormBase>
        }
      >
        {translate(
          isAlbumPublished
            ? "album.status.published"
            : "album.status.unpublished"
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          {isAlbumPublished && (
            <input
              type="text"
              readOnly
              size={publicLink.length - 10}
              onFocus={(e) => e.target.select()}
              value={publicLink}
            />
          )}

          {isAlbumPublished && (
            <>
              <button
                type="button"
                onClick={copy}
                className="callout-action callout-action-small"
              >
                <Icon>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" />
                </Icon>
                {translate("share.copy.button.label")}
              </button>

              {canShare && (
                <button
                  type="button"
                  className="callout-action callout-action-small"
                  onClick={share}
                >
                  <Icon>
                    <path d="m16 5-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2" />
                  </Icon>
                  {translate("share.share.button.label")}
                </button>
              )}
            </>
          )}

          {!hideShowButton && (
            <Link
              className="callout-action callout-action-small"
              to={`/albums/${albumId}`}
              viewTransition
            >
              <EyeIcon />
              {translate("global.see")}
            </Link>
          )}

          {!hideEditButton && (
            <Link
              className="callout-action callout-action-small"
              to={`/account/albums/${albumId}`}
              viewTransition
            >
              <Icon>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z" />
              </Icon>
              {translate("global.edit")}
            </Link>
          )}
        </div>
      </Callout>
    </div>
  );
}
