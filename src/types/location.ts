export type LocationBase = {
  photoName: string;
  authorName: string;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type LocationFull = LocationBase &
  Coordinates & {
    guess_median_x: number;
    guess_median_y: number;
    guesses_count: number;
  };
