export type LocationBase = {
  photoName: string;
  authorName: string;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type LocationFull = LocationBase & Coordinates;
