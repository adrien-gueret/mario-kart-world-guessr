import type { ReactNode } from "react";

import "./ConstraintContainer.css";

type Props = {
  children: ReactNode;
};

export default function ConstraintContainer({ children }: Props) {
  return <div className="constraint-container">{children}</div>;
}
