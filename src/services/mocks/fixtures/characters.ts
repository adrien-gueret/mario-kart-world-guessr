import { defaultCharacters, lockedCharacters } from "@/characters";

export type CharacterState = {
  id: string;
  isUnlocked: boolean;
};

/** Default characters are unlocked, locked ones stay locked in mock mode. */
export const characters: CharacterState[] = [
  ...defaultCharacters.map((id) => ({ id, isUnlocked: true })),
  ...lockedCharacters.map((id) => ({ id, isUnlocked: false })),
];
