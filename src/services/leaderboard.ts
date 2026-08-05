/**
 * Returns the "top X%" percentile for a given 1-based rank within a leaderboard
 * of `total` players. Lower is better (rank 1 in a large board -> small percent).
 * Always at least 1 so a first place never shows "top 0%".
 */
export function getPercentile(rank: number, total: number): number {
  if (total <= 0 || rank <= 0) {
    return 100;
  }

  return Math.max(1, Math.round((rank / total) * 100));
}
