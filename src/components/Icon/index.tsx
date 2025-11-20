import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export default function Icon(props: Props) {
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props} />
  );
}
