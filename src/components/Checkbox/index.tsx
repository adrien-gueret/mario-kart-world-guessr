import Text from "../Text";

import "./Checkbox.css";

type Props = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Checkbox({ name, checked, onChange, label }: Props) {
  return (
    <label className="checkbox-label">
      <input
        name={name}
        type="checkbox"
        className="checkbox-label__real_checkbox"
        checked={checked}
        onChange={(event) => {
          onChange?.(event.target.checked);
        }}
      />
      <span className="checkbox-label__checkbox" />
      <Text>{label}</Text>
    </label>
  );
}
