import "./Tag.css";

type Props = {
  children: React.ReactNode;
  variant?: "neutral" | "easy" | "medium" | "hard";
};

export default function Tag({ children, variant = "neutral" }: Props) {
  return <span className={`tag ${variant}`}>{children}</span>;
}
