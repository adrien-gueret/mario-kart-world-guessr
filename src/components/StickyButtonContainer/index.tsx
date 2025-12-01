import "./StickyButtonContainer.css";

export default function StickyButtonContainer({
  children,
  withDelay = false,
}: {
  children: React.ReactNode;
  withDelay?: boolean;
}) {
  return (
    <div
      className={`game-sticky-button-container${
        withDelay ? " with-delay" : ""
      }`}
    >
      {children}
    </div>
  );
}
