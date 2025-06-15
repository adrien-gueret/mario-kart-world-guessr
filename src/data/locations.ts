export type LocationBase = {
  photoName: string;
  coordinates: {
    x: number;
    y: number;
  };
};

const localations = [
  {
    photoName: "2be16eee-9c6d-4292-b959-d62676c32e7c",
    coordinates: { x: 681, y: 962 },
  },
  {
    photoName: "9abc315f-7f3d-4cec-9c6d-f855bb2cb068",
    coordinates: { x: 660, y: 531 },
  },
  {
    photoName: "0055b48a-1d22-4eaa-80fe-57ffc605e284",
    coordinates: { x: 476, y: 604 },
  },
  {
    photoName: "ffce338c-7391-41a9-ad09-5b39124750f3",
    coordinates: { x: 609, y: 405 },
  },
  {
    photoName: "c6009385-2b29-49b9-8d00-90615962cc94",
    coordinates: { x: 693, y: 346 },
  },
  {
    photoName: "dda13833-a3f9-40e9-9d1c-43ac31516292",
    coordinates: { x: 1225, y: 677 },
  },
  {
    photoName: "fe470dcc-cf21-4d56-9b61-f0abbfec1ee1",
    coordinates: { x: 271, y: 736 },
  },
] as const satisfies ReadonlyArray<LocationBase>;

export type Location = (typeof localations)[number];

export default function getRandomLocation(): Location {
  const randomIndex = Math.floor(Math.random() * localations.length);
  return localations[randomIndex];
}
