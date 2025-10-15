import type { ReactNode } from "react";

import Text from "../Text";

import "./Checkbox.css";

type Props = {
  id?: string;
  name: string;
  label: ReactNode;
  checked: boolean;
  isRadio?: boolean;
  value?: string;
  onChange: (checked: boolean) => void;
  variant?: "default" | "glued";
};

export default function Checkbox({
  id,
  name,
  checked,
  onChange,
  label,
  isRadio,
  value,
  variant = "default",
}: Props) {
  return (
    <label className={`checkbox-label checkbox-label--${variant}`}>
      <input
        id={id}
        name={name}
        type={isRadio ? "radio" : "checkbox"}
        className="checkbox-label__real_checkbox"
        checked={checked}
        onChange={(event) => {
          onChange?.(event.target.checked);
        }}
        value={value}
      />
      <span className="checkbox-label__checkbox" />
      <Text>{label}</Text>
    </label>
  );
}
