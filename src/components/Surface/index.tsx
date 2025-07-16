import type { ReactNode } from "react";

import "./Surface.css";

type Props = {
  children: ReactNode;
  disableSkew?: boolean;
};

export default function Surface({ children, disableSkew }: Props) {
  return (
    <div className={`surface ${disableSkew ? "disable-skew" : ""}`}>
      <div className="surface-content">{children}</div>
    </div>
  );
}
