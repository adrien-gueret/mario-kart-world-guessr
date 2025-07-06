import { type ReactNode } from "react";

import Text from "../Text";

import "./Modal.css";

type Props = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  noDelay?: boolean;
  disableSkew?: boolean;
};

export default function Modal({
  children,
  title,
  isOpen,
  noDelay = false,
  disableSkew = false,
}: Props) {
  return isOpen ? (
    <div className={`modal-overlay ${noDelay ? "no-delay" : ""}`}>
      <div className={`modal-box ${disableSkew ? "no-skew" : ""}`}>
        <div className="modal-inner">
          <h2>{title}</h2>
          <Text component="div">{children}</Text>
        </div>
      </div>
    </div>
  ) : null;
}
