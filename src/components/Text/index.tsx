import "./Text.css";

type Props = {
  children: React.ReactNode;
  component?: React.ElementType;
  display?: "inline-block" | "block" | "";
  reverseColors?: boolean;
};

export default function Text({
  children,
  component: Component = "span",
  display = Component === "li" ? "" : "inline-block",
  reverseColors = false,
}: Props) {
  return <Component className={`text ${display} ${reverseColors ? "reverse-colors" : ""}`}>{children}</Component>;
}
