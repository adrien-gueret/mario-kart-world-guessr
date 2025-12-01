import { type ReactNode, type MouseEvent, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

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
  onClose?: () => void;
};

export default function Modal({
  children,
  title,
  isOpen,
  imageUrl,
  onClose,
  noDelay = false,
  disableSkew = false,
  isDrawer = false,
}: Props) {
  useLayoutEffect(() => {
    if (isOpen && isDrawer) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = sbw + "px";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, isDrawer]);

  const onOverlayClick = onClose
    ? (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }
    : undefined;

  return isOpen
    ? createPortal(
        <div
          className={`modal-overlay ${noDelay ? "no-delay" : ""}  ${
            isDrawer ? "drawer" : ""
          }`}
          onClick={onOverlayClick}
        >
          {imageUrl && (
            <div
              className="modal-image"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
          <div
            className={`modal-box ${disableSkew || isDrawer ? "no-skew" : ""}`}
          >
            <div className="modal-inner">
              <h2>{title}</h2>
              <Text component="div" display="block">
                {children}
              </Text>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
