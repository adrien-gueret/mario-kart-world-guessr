import type { ButtonHTMLAttributes } from "react";

import arrowUrl from "./arrow.svg";
import "./Button.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary";
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...otherProps
}: Props) {
  return (
    <button className={`game-button ${className} ${variant}`} {...otherProps}>
      {children}
      <img draggable="false" alt="" src={arrowUrl} />
    </button>
  );
}
