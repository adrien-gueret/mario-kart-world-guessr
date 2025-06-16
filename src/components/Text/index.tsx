import "./Text.css";

type Props = {
  children: React.ReactNode;
  component?: React.ElementType;
};

export default function Text({
  children,
  component: Component = "span",
}: Props) {
  return <Component className="text">{children}</Component>;
}
