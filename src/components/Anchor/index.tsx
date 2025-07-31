import type { AnchorHTMLAttributes } from "react";

import "./Anchor.css";

export default function Anchor({
  href,
  children,
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      className="anchor"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        document
          .querySelector(href)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </a>
  );
}
