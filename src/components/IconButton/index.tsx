import type { ButtonHTMLAttributes } from "react";
import Icon, { type Props as IconProps } from "../Icon";

import "./IconButton.css";

type Props = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children" | "className" | "style"
> & {
  "aria-label": string;
  children: IconProps["children"];
  color?: string;
};

export default function IconButton({
  children,

  color = "#213547",
  ...props
}: Props) {
  return (
    <button type="button" {...props} className="icon-button" style={{ color }}>
      <Icon>{children}</Icon>
    </button>
  );
}
