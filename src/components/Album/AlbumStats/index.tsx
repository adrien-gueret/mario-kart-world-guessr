import type { ReactNode } from "react";

import { useTranslations } from "@/i18n";

import "./AlbumStats.css";

type Props = {
  players: number;
  averageScore: number;
  bestScore: number;
  yourRank?: { rank: number; percentile: number } | null;
};

function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="album-stats__card">
      <span className="album-stats__value">{value}</span>
      <span className="album-stats__label">{label}</span>
    </div>
  );
}

export default function AlbumStats({
  players,
  averageScore,
  bestScore,
  yourRank,
}: Props) {
  const { translate } = useTranslations();

  return (
    <div className="album-stats">
      <StatCard label={translate("album.stats.players")} value={players} />
      <StatCard label={translate("album.stats.bestScore")} value={bestScore} />
      <StatCard
        label={translate("album.stats.averageScore")}
        value={averageScore}
      />
      {yourRank && (
        <StatCard
          label={translate("album.stats.yourRank")}
          value={
            <>
              #{yourRank.rank}
              <span className="album-stats__percentile">
                Top {yourRank.percentile}%
              </span>
            </>
          }
        />
      )}
    </div>
  );
}
