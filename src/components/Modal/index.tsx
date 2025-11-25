import { type ReactNode } from "react";

import Text from "../Text";

import "./Modal.css";

type Props = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  noDelay?: boolean;
  disableSkew?: boolean;
  imageUrl?: string;
  isDrawer?: boolean;
};

export default function Modal({
  children,
  title,
  isOpen,
  imageUrl,
  noDelay = false,
  disableSkew = false,
  isDrawer = false,
}: Props) {
  return isOpen ? (
    <div
      className={`modal-overlay ${noDelay ? "no-delay" : ""}  ${
        isDrawer ? "drawer" : ""
      }`}
    >
      {imageUrl && (
        <div
          className="modal-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className={`modal-box ${disableSkew || isDrawer ? "no-skew" : ""}`}>
        <div className="modal-inner">
          <h2>{title}</h2>
          <Text component="div" display="block">
            {children}
          </Text>
        </div>
      </div>
    </div>
  ) : null;
}
