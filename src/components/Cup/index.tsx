import type { Cup, StarRank } from "@/types/game";

import "./Cup.css";

type Props = {
  cup: Cup;
  starRank?: StarRank | null;
};

export default function Cup({ cup, starRank }: Props) {
  return <div className={`cup ${cup} ${starRank ?? ""}`} />;
}
