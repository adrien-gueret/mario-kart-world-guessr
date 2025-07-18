import "./LeaderboardRow.css";

type Props = {
  rank: number;
  username: string;
  marioCharacter?: string;
  score: number;
  secondaryScore?: number;
  isHighlighted?: boolean;
};

export default function LeaderboardRow({
  rank,
  username,
  marioCharacter,
  score,
  secondaryScore,
  isHighlighted,
}: Props) {
  return (
    <tr className={`leaderboard-row ${isHighlighted ? "is-highlighted" : ""}`}>
      <th className="leaderboard-cell-rank">{rank}</th>
      <th
        className={`leaderboard-cell-name ${
          marioCharacter ? `leaderboard-cell-character ${marioCharacter}` : ""
        }`}
      >
        {username}
      </th>
      <td>
        {score}
        {Boolean(secondaryScore) && (
          <span className="leaderboard-cell-secondary-score-container">
            {secondaryScore}
          </span>
        )}
      </td>
    </tr>
  );
}
