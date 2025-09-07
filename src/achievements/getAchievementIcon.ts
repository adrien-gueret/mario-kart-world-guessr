import type { Achievement } from "@/types/achievements";

export default function getAchievementIcon(
  achievementId: Achievement
): string | undefined {
  const iconMap: Record<Achievement, string> = {
    gold_50cc_goal: "./ui/characters/dk.png",
    gold_100cc_goal: "./ui/characters/toad.png",
    gold_150cc_goal: "./ui/characters/king_boo.png",
    gold_mirror_goal: "./ui/characters/pauline.png",
    gold_50cc_survival: "./ui/characters/daisy.png",
    gold_100cc_survival: "./ui/characters/green_yoshi.png",
    gold_150cc_survival: "./ui/characters/wario.png",
    gold_mirror_survival: "./ui/characters/rosalina.png",
    "5000_points": "./ui/characters/shyguy.png",
    "4000_three_in_a_row": "./ui/characters/lakitu.png",
  };

  return iconMap[achievementId];
}
