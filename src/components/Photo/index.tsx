import { useState, useLayoutEffect } from "react";

import { useTranslations } from "@/i18n";

import type { UsableMarioCharacter } from "@/characters";

import Loader from "../Loader";

import "./Photo.css";

export default function Photo({
  photoName,
  isMirrored,
  author,
  minWidth = 0,
  minHeight = 0,
}: {
  photoName?: string;
  isMirrored?: boolean;
  author?: {
    id: number;
    name: string;
    character: UsableMarioCharacter | null;
  } | null;
  minWidth?: number;
  minHeight?: number;
}) {
  const [isComplete, setIsComplete] = useState(false);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const { translate } = useTranslations();

  const photoUrl = photoName
    ? `https://ik.imagekit.io/mkwg/${photoName}.jpg`
    : null;

  useLayoutEffect(() => {
    const onResize = () => {
      setWidth(0);
      setHeight(0);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minWidth: `${width || minWidth}px`,
        minHeight: `${height || minHeight}px`,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: !photoUrl || !isComplete ? "block" : "none",
          position: "absolute",
          top: `calc(50% - 32px)`,
          left: `calc(50% - 32px)`,
        }}
      >
        <Loader />
      </div>

      {photoUrl && (
        <>
          <img
            className={`game-photo ${isMirrored ? "mirrored" : ""}`}
            draggable={false}
            src={photoUrl}
            style={{ opacity: isComplete ? 1 : 0.1 }}
            onLoad={(e) => {
              setIsComplete(true);

              const image = e.currentTarget as HTMLImageElement;

              window.requestAnimationFrame(() => {
                setHeight(image.height);
                setWidth(image.width);
              });
            }}
            alt=""
          />

          {author && isComplete && (
            <p className="game-photo-author">
              <span>
                {translate("photo.by")} <b>{author?.name}</b>
              </span>
              {author.character && (
                <img
                  style={{ width: "32px", verticalAlign: "text-bottom" }}
                  src={`./ui/pins/icon-${author.character}.png`}
                  alt=""
                />
              )}
            </p>
          )}
        </>
      )}
    </div>
  );
}
