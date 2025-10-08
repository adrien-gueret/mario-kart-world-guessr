import "./Line.css";

interface LineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function Line({ x1, y1, x2, y2 }: LineProps) {
  return (
    <line
      className="game-map-line"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#000"
      strokeWidth={3}
    />
  );
}
