import { type ReactNode, useLayoutEffect } from "react";

import Text from "../Text";

import "./Dialog.css";

type Props = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
};

export default function Dialog({ children, title, isOpen }: Props) {
  useLayoutEffect(() => {
    if (isOpen) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }
  }, [isOpen]);

  return isOpen ? (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-inner">
          <h2>{title}</h2>
          <Text>{children}</Text>
        </div>
      </div>
    </div>
  ) : null;
}
