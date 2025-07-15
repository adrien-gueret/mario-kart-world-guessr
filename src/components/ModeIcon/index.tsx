import type { GameMode } from "@/types/game";

import "./ModeIcon.css";

type Props = {
  mode: GameMode;
};

export default function ModeIcon({ mode }: Props) {
  return <picture className={`mode-icon mode-${mode}`} />;
}
