import type { Achievement } from "@/types/achievements";

export default function getAchievementIcon(
  achievementId: Achievement,
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
    gold_50cc_chrono: "./ui/characters/bowser_jr.png",
    gold_100cc_chrono: "./ui/characters/baby_luigi.png",
    gold_150cc_chrono: "./ui/characters/baby_peach.png",
    gold_mirror_chrono: "./ui/characters/baby_mario.png",
    "5000_points": "./ui/characters/shyguy.png",
    "4000_three_in_a_row": "./ui/characters/lakitu.png",
    photo_validated: "./ui/characters/toadette.png",
    break_everything: "./ui/characters/waluigi.png",
  };

  return iconMap[achievementId];
}
