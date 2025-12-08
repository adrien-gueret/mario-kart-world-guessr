import "./Callout.css";

export interface CalloutProps {
  type: "success" | "warning";
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function Callout({ type, children, action }: CalloutProps) {
  return (
    <aside className={`callout callout-${type}`}>
      <div className="callout-content">
        <div className="callout-icon-container">
          <figure className="callout-icon" />
        </div>
        <div className="callout-children">{children}</div>
        {action && <div className="callout-actions-container">{action}</div>}
      </div>
    </aside>
  );
}
