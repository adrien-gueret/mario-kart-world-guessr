export const defaultCharacters = ["mario", "luigi", "peach", "bowser"] as const;
export type DefaultMarioCharacter = (typeof defaultCharacters)[number];

export const lockedCharacters = [
  "daisy",
  "green_yoshi",
  "wario",
  "dk",
  "toad",
  "king_boo",
  "rosalina",
  "pauline",
  "shyguy",
  "lakitu",
  "toadette",
  "waluigi",
] as const;
export type LockedMarioCharacter = (typeof lockedCharacters)[number];

const unusableCharacters = [
  "baby_mario",
  "baby_luigi",
  "baby_peach",
  "baby_daisy",
  "baby_rosalina",
  "bowser_jr",
  "birdo",
  "koopa_troopa",
  "nabbit",
  "goomba",
  "dry_bones",
  "piranha_plant",
  "spike",
  "wiggler",
  "hammer_bro",
  "sidestepper",
  "monty_mole",
  "rocky_wrench",
  "cheep_cheep",
  "cataquack",
  "pianta",
  "conkdor",
  "swoop",
  "pokey",
  "peepa",
  "stingby",
  "fish_bone",
  "coin_coffer",
  "cow",
  "snowman",
  "penguin",
  "dolphin",
  "para_biddybud",
  "chargin_chuck",
] as const;

export type UnusableMarioCharacter = (typeof unusableCharacters)[number];

export type MarioCharacter =
  | DefaultMarioCharacter
  | LockedMarioCharacter
  | UnusableMarioCharacter;

export type UsableMarioCharacter = Exclude<
  MarioCharacter,
  UnusableMarioCharacter
>;

export const allCharacters: MarioCharacter[] = [
  ...defaultCharacters,
  ...lockedCharacters,
  ...unusableCharacters,
] as const;
