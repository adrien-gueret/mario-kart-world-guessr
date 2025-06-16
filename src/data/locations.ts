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
    coordinates: { x: 761, y: 1075 },
  },
  {
    photoName: "9abc315f-7f3d-4cec-9c6d-f855bb2cb068",
    coordinates: { x: 738, y: 594 },
  },
  {
    photoName: "0055b48a-1d22-4eaa-80fe-57ffc605e284",
    coordinates: { x: 532, y: 675 },
  },
  {
    photoName: "ffce338c-7391-41a9-ad09-5b39124750f3",
    coordinates: { x: 681, y: 453 },
  },
  {
    photoName: "c6009385-2b29-49b9-8d00-90615962cc94",
    coordinates: { x: 775, y: 387 },
  },
  {
    photoName: "dda13833-a3f9-40e9-9d1c-43ac31516292",
    coordinates: { x: 1370, y: 757 },
  },
  {
    photoName: "fe470dcc-cf21-4d56-9b61-f0abbfec1ee1",
    coordinates: { x: 303, y: 823 },
  },
  {
    photoName: "6ed89029-9f43-4baf-ac3d-0a79e6217b59",
    coordinates: { x: 120, y: 940 },
  },
  {
    photoName: "5d15b29e-8a1f-46c2-9fee-7a8ac98604a2",
    coordinates: { x: 609, y: 259 },
  },
  {
    photoName: "91d0749d-cde8-42af-a6b9-2a06253aea20",
    coordinates: { x: 289, y: 373 },
  },
  {
    photoName: "bb5ea379-8c7a-4fb0-8126-5cd24d0030be",
    coordinates: { x: 449, y: 959 },
  },
  {
    photoName: "639cece0-4272-47ee-bd08-eb72c4c01189",
    coordinates: { x: 451, y: 1149 },
  },
  {
    photoName: "3f1aa5bb-c73d-49d8-9213-b23ebb205aa2",
    coordinates: { x: 537, y: 1009 },
  },
  {
    photoName: "daa455ae-1f71-49df-941a-4a6c474ed40d",
    coordinates: { x: 1146, y: 932 },
  },
  {
    photoName: "7aa89aa4-10ab-474f-8d24-d3239e9aea77",
    coordinates: { x: 944, y: 1039 },
  },
] as const satisfies ReadonlyArray<LocationBase>;

export type Location = (typeof localations)[number];

export default function getRandomLocation(): Location {
  const randomIndex = Math.floor(Math.random() * localations.length);
  return localations[randomIndex];
}
