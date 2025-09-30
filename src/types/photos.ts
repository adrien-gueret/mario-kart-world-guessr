export type Photo = {
  id: string;
  difficulty: "easy" | "medium" | "hard" | null;
  validatedAt: string | null;
  photoUrl: string;
  suggestionCount: number;
};

export type PhotoFilter = NonNullable<Photo["difficulty"]> | "all";
