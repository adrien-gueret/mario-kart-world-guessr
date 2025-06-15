import type { ButtonHTMLAttributes } from "react";

import arrowUrl from "./arrow.svg";
import "./Button.css";

export default function Button({
  children,
  ...otherProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="game-button" {...otherProps}>
      {children}
      <img draggable="false" alt="" src={arrowUrl} />
    </button>
  );
}
