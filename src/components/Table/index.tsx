import { type ReactNode } from "react";

import "./Table.css";

type Props = {
  children: ReactNode;
  footer: ReactNode;
};

export default function Table({ children, footer }: Props) {
  return (
    <table className="table">
      {children && <tbody>{children}</tbody>}
      {footer && <tfoot>{footer}</tfoot>}
    </table>
  );
}
