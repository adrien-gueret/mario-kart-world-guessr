import "./Text.css";

type Props = {
  children: React.ReactNode;
  component?: React.ElementType;
  display?: "inline-block" | "block" | "";
};

export default function Text({
  children,
  component: Component = "span",
  display = Component === "li" ? "" : "inline-block",
}: Props) {
  return <Component className={`text ${display}`}>{children}</Component>;
}
