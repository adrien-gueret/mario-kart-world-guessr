import { type ReactNode, useLayoutEffect } from "react";

import Text from "../Text";

import "./Modal.css";

type Props = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  noDelay?: boolean;
};

export default function Modal({
  children,
  title,
  isOpen,
  noDelay = false,
}: Props) {
  useLayoutEffect(() => {
    if (isOpen) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }
  }, [isOpen]);

  return isOpen ? (
    <div className={`modal-overlay ${noDelay ? "no-delay" : ""}`}>
      <div className="modal-box">
        <div className="modal-inner">
          <h2>{title}</h2>
          <Text>{children}</Text>
        </div>
      </div>
    </div>
  ) : null;
}
