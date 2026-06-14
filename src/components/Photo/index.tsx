import { useState, useLayoutEffect, useRef, useCallback } from "react";

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
  onReady,
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
  onReady?: () => void;
}) {
  const [isComplete, setIsComplete] = useState(false);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const { translate } = useTranslations();

  const imgRef = useRef<HTMLImageElement>(null);
  const hasFiredReadyRef = useRef(false);

  const photoUrl = photoName
    ? `https://ik.imagekit.io/mkwg/${photoName}.jpg`
    : null;

  // Marks the photo as ready. Guarded so it only runs once per loaded image,
  // whether it was triggered by the <img> onLoad event or by the cache-safety
  // check below.
  const handleReady = useCallback(() => {
    if (hasFiredReadyRef.current) {
      return;
    }

    hasFiredReadyRef.current = true;

    setIsComplete(true);

    onReady?.();

    const image = imgRef.current;

    if (image) {
      window.requestAnimationFrame(() => {
        setHeight(image.height);
        setWidth(image.width);
      });
    }
  }, [onReady]);

  // Cache-safety net: when the image comes from the browser cache it can already
  // be "complete" before React attaches the onLoad handler, so onLoad would
  // never fire. Re-check on every photo change and fire manually if needed.
  useLayoutEffect(() => {
    hasFiredReadyRef.current = false;
    setIsComplete(false);

    const image = imgRef.current;

    if (image && image.complete && image.naturalWidth > 0) {
      handleReady();
    }
  }, [photoUrl, handleReady]);

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
            ref={imgRef}
            className={`game-photo ${isMirrored ? "mirrored" : ""}`}
            draggable={false}
            src={photoUrl}
            style={{ opacity: isComplete ? 1 : 0.1 }}
            onLoad={handleReady}
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
