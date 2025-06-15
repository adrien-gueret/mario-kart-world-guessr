import "./Line.css";

interface LineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function Line({ x1, y1, x2, y2 }: LineProps) {
  return (
    <svg
      className="game-map-line"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.5,
      }}
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth={3} />
    </svg>
  );
}
