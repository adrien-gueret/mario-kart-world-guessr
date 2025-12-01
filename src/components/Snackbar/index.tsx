import { type ReactNode, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

import Text from "@/components/Text";

import "./Snackbar.css";

type Props = {
  type?: "success" | "error" | "info";
  icon?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  timeout?: number;
};

export default function Snackbar({
  children,
  type = "success",
  icon,
  isOpen,
  onClose,
  timeout = 3000,
}: Props) {
  useLayoutEffect(() => {
    if (!isOpen || !onClose) {
      return;
    }

    const clock = setTimeout(onClose, timeout);

    return () => {
      clearTimeout(clock);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <div className={`snackbar-container ${isOpen ? "snackbar-open" : ""}`}>
      <div className={`snackbar snackbar-${type}`}>
        {icon && (
          <picture
            className="snackbar-icon"
            style={{ backgroundImage: `url(${icon})` }}
          />
        )}
        <Text component="div" reverseColors>
          {children}
        </Text>
      </div>
    </div>,
    document.body
  );
}
