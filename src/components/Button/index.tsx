import type { ButtonHTMLAttributes } from "react";

import arrowUrl from "./arrow.svg";
import "./Button.css";

export default function Button({
  children,
  className = "",
  ...otherProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`game-button ${className}`} {...otherProps}>
      {children}
      <img draggable="false" alt="" src={arrowUrl} />
    </button>
  );
}
