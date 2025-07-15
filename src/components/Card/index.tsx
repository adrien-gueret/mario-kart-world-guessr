import { type ReactNode } from "react";

import Text from "@/components/Text";

import "./Card.css";

type Props = {
  icon: ReactNode;
  title: string;
  content: ReactNode;
  borderColor?: string;
  onClick?: () => void;
};

export default function Card({
  icon,
  title,
  content,
  onClick,
  borderColor,
}: Props) {
  const isClickable = Boolean(onClick);

  const iconStyle = borderColor ? { borderColor } : {};

  return (
    <button
      tabIndex={isClickable ? 0 : -1}
      onClick={onClick}
      className={`card ${isClickable ? "" : "disabled"}`}
    >
      <div className="card__icon" style={iconStyle}>
        <div className="card__icon__images">{icon}</div>
        <div className="card__title">{title}</div>
      </div>

      <div className="card__desc">
        <Text>{content}</Text>
      </div>
    </button>
  );
}
