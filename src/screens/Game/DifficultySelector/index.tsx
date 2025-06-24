import type { Difficulty } from "@/types/game";

type Props = {
  value: Difficulty | null;
  onSelect: (difficulty: Difficulty) => void;
  difficulties?: Difficulty[];
};

export default function DifficultySelector({
  value,
  onSelect,
  difficulties = ["50cc", "100cc", "150cc", "mirror"],
}: Props) {
  return (
    <div className="difficulty-selector">
      {difficulties.map((difficulty) => (
        <label key={difficulty} className="difficulty-option">
          <input
            type="radio"
            name="difficulty"
            value={difficulty}
            checked={value === difficulty}
            onChange={() => onSelect(difficulty)}
          />
          <span>{difficulty}</span>
        </label>
      ))}
    </div>
  );
}
