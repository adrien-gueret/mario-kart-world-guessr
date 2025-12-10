import { type ReactNode, useRef, useState } from "react";

import { useTranslations } from "@/i18n";

import { useThrottle } from "@/services/throttle";

import Text from "../Text";

import "./ColorPicker.css";

type Props = {
  id: string;
  name: string;
  label: ReactNode;
  defaultValue?: string;
  onChange?: (color: string) => void;
};

function extractAlphaFromHex(hex: string): {
  plainColor: string;
  alpha: number;
} {
  if (hex.length === 9) {
    const alphaHex = hex.slice(7, 9);
    return {
      plainColor: hex.slice(0, 7),
      alpha: parseInt(alphaHex, 16) / 255,
    };
  }
  return { plainColor: hex, alpha: 1 };
}

function alphaToHex(alpha: number): string {
  const alphaInt = Math.round(alpha * 255);
  const hex = alphaInt.toString(16).padStart(2, "0");
  return hex;
}

export default function ColorPicker({
  id,
  name,
  onChange = () => {},
  label,
  defaultValue = "#ffffff00",
}: Props) {
  const { translate } = useTranslations();
  const inputColorRef = useRef<HTMLInputElement>(null);

  const [color, setColor] = useState(() => extractAlphaFromHex(defaultValue));

  const onChangeThrottled = useThrottle(onChange, 250);

  const fullColor = color.plainColor + alphaToHex(color.alpha);

  const handleColorInput = (e: React.FormEvent<HTMLInputElement>) => {
    const newPlainColor = e.currentTarget.value;
    setColor((prevColor) => ({
      ...prevColor,
      plainColor: newPlainColor,
    }));
    onChangeThrottled(newPlainColor + alphaToHex(color.alpha));
  };

  const handleRangeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const newAlpha = parseFloat(e.currentTarget.value);

    setColor((prevColor) => ({
      ...prevColor,
      alpha: newAlpha,
    }));
    onChangeThrottled(color.plainColor + alphaToHex(newAlpha));
  };

  return (
    <div className="color-picker">
      <input type="hidden" name={name} value={fullColor} />
      <div className="color-picker-group">
        <Text>
          <label className="color-picker-label" htmlFor={id}>
            {label}
          </label>
        </Text>

        <input
          ref={inputColorRef}
          id={id}
          name={`${name}-plain-color`}
          type="color"
          className="color-picker__real_input no-form-style"
          defaultValue={color.plainColor}
          onInput={handleColorInput}
        />
        <button
          onClick={() => inputColorRef.current?.click()}
          type="button"
          className="color-picker__preview"
          style={{ backgroundColor: color.plainColor }}
        />
      </div>

      <div className="color-picker-group">
        <Text>
          <label className="color-picker-alpha-label" htmlFor={`${id}-alpha`}>
            {translate("global.alpha")}
          </label>
        </Text>

        <input
          id={`${id}-alpha`}
          name={`${name}-alpha`}
          className="color-picker-range no-form-style"
          type="range"
          min="0"
          max="1"
          step="0.1"
          defaultValue={color.alpha}
          onInput={handleRangeInput}
        />
      </div>
    </div>
  );
}
