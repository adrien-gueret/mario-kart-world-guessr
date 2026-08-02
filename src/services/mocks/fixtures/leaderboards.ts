import type { LeaderboardsResponse } from "@/types/game";

export const leaderboards: LeaderboardsResponse = [
  {
    playerId: 7,
    playerName: "Toadstool",
    marioCharacter: "peach",
    score: 24850,
    photoCount: 12,
    rank: 1,
    isAnonymous: 0,
  },
  {
    playerId: 12,
    playerName: "KoopaKing",
    marioCharacter: "bowser",
    score: 23110,
    photoCount: 9,
    rank: 2,
    isAnonymous: 0,
  },
  {
    playerId: 1,
    playerName: "MockPlayer",
    marioCharacter: "mario",
    score: 21990,
    photoCount: 6,
    rank: 3,
    isAnonymous: 0,
  },
  {
    playerId: 4,
    playerName: "Anonyme",
    marioCharacter: null,
    score: 18400,
    rank: 4,
    isAnonymous: 1,
  },
  {
    playerId: 9,
    playerName: "LuigiTime",
    marioCharacter: "luigi",
    score: 15230,
    photoCount: 3,
    rank: 5,
    isAnonymous: 0,
  },
];

/** Bot-only leaderboard used by the game-end screen (`only-bots=1`). */
export const botLeaderboards: LeaderboardsResponse = [
  {
    playerId: 1001,
    playerName: "Bot Wario",
    marioCharacter: "wario",
    score: 22500,
    rank: 1,
    isAnonymous: 0,
  },
  {
    playerId: 1002,
    playerName: "Bot Daisy",
    marioCharacter: "daisy",
    score: 20100,
    rank: 2,
    isAnonymous: 0,
  },
  {
    playerId: 1003,
    playerName: "Bot Toad",
    marioCharacter: "toad",
    score: 17800,
    rank: 3,
    isAnonymous: 0,
  },
];
