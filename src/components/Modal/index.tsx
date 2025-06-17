import { type ReactNode, useLayoutEffect } from "react";

import Text from "../Text";

import "./Modal.css";

type Props = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
};

export default function Modal({ children, title, isOpen }: Props) {
  useLayoutEffect(() => {
    if (isOpen) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }
  }, [isOpen]);

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-inner">
          <h2>{title}</h2>
          <Text>{children}</Text>
        </div>
      </div>
    </div>
  ) : null;
}
