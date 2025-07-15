import type { ReactNode } from "react";

import "./Surface.css";

type Props = {
  children: ReactNode;
};

export default function Surface({ children }: Props) {
  return (
    <div className="surface">
      <div className="surface-content">{children}</div>
    </div>
  );
}
