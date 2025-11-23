import "./StickyButtonContainer.css";

export default function StickyButtonContainer({
  children,
  withDelay = false,
  withSafeArea = false,
}: {
  children: React.ReactNode;
  withDelay?: boolean;
  withSafeArea?: boolean;
}) {
  return (
    <div
      className={`game-sticky-button-container${
        withDelay ? " with-delay" : ""
      }${withSafeArea ? " with-safe-area" : ""}`}
    >
      {children}
    </div>
  );
}
