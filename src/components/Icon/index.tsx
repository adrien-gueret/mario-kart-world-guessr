import type { SVGProps } from "react";

export type Props = SVGProps<SVGSVGElement>;

import "./Icon.css";

export default function Icon(props: Props) {
  return (
    <svg
      className="icon"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      {...props}
    />
  );
}
