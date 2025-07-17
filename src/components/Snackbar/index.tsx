import { type ReactNode, useLayoutEffect } from "react";

import Text from "@/components/Text";

import "./Snackbar.css";

type Props = {
  type?: "success" | "error";
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Snackbar({
  children,
  type = "success",
  isOpen,
  onClose,
}: Props) {
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const clock = setTimeout(onClose, 3000);

    return () => {
      clearTimeout(clock);
    };
  }, [isOpen]);

  return (
    <div
      className={`snackbar snackbar-${type} ${isOpen ? "snack-bar-open" : ""}`}
    >
      <Text component="div" reverseColors>
        {children}
      </Text>
    </div>
  );
}
