import { useRef, useState } from "react";

import Loader from "../Loader";

import "./Photo.css";

export default function Photo({ photoName }: { photoName: string }) {
  const [isComplete, setIsComplete] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const photoUrl = `./photos/${photoName}.jpg`;

  return (
    <>
      <div style={{ display: isComplete ? "none" : "block" }}>
        <Loader />
      </div>

      <img
        ref={imageRef}
        className="game-photo"
        draggable={false}
        src={photoUrl}
        style={{ opacity: isComplete ? 1 : 0.1 }}
        onLoad={() => setIsComplete(true)}
        alt=""
      />
    </>
  );
}
