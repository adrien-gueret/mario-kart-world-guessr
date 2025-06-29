import { useState, useLayoutEffect } from "react";

import Loader from "../Loader";

import "./Photo.css";

export default function Photo({
  photoName,
  isMirrored,
}: {
  photoName?: string;
  isMirrored?: boolean;
}) {
  const [isComplete, setIsComplete] = useState(false);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const photoUrl = photoName ? `./photos/${photoName}.jpg` : null;

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
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        textAlign: "center",
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
      )}
    </div>
  );
}
