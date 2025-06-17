import { useRef, useCallback, use } from "react";

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
  {
    photoName: "97dad49f-d207-4ff5-a4e8-ae3c442fb8ca",
    coordinates: { x: 1063, y: 1104 },
  },
  {
    photoName: "9bf9209c-c821-4bbf-8c66-082d143ffdd0",
    coordinates: { x: 1170, y: 1037 },
  },
  {
    photoName: "dba9a5d6-f776-493d-8415-71c02244e687",
    coordinates: { x: 1233, y: 1005 },
  },
  {
    photoName: "3f48784a-5221-4c70-9a54-f4fc34e220ba",
    coordinates: { x: 177, y: 760 },
  },
  {
    photoName: "d9bfe8eb-799b-4c8b-8d8a-24abcf832c5f",
    coordinates: { x: 865, y: 785 },
  },
  {
    photoName: "9b88e8e0-23df-4f2c-9c02-c74dd12c0889",
    coordinates: { x: 902, y: 200 },
  },
  {
    photoName: "088b3a66-b99e-45d8-882a-cc62c60c3fa0",
    coordinates: { x: 754, y: 150 },
  },
  {
    photoName: "ef16e447-71b8-4696-afd8-7ded946aa147",
    coordinates: { x: 750, y: 236 },
  },
  {
    photoName: "f16dcb7e-5474-4fcc-af2c-7d45ed08a523",
    coordinates: { x: 544, y: 1134 },
  },
  {
    photoName: "52376693-4951-4289-b94a-1504d8ea7edb",
    coordinates: { x: 839, y: 959 },
  },
  {
    photoName: "df9be67b-a019-4537-a185-60d8e465971a",
    coordinates: { x: 805, y: 1007 },
  },
  {
    photoName: "e80a2a99-c0b5-4da8-baff-5c8b7e0f9fdb",
    coordinates: { x: 674, y: 991 },
  },
  {
    photoName: "442631ad-3df3-4595-b394-52bbfed7e305",
    coordinates: { x: 495, y: 407 },
  },
  {
    photoName: "3bc536d8-b0a1-43f8-9cab-1fa33635e980",
    coordinates: { x: 586, y: 806 },
  },
  {
    photoName: "15274505-af4b-4e39-82a3-e9764cf38728",
    coordinates: { x: 506, y: 776 },
  },
  {
    photoName: "989f6e11-67ff-49bc-af28-73300a0e6fc8",
    coordinates: { x: 184, y: 510 },
  },
  {
    photoName: "fea3d543-ffa3-411b-ba4b-0e4df526f9d5",
    coordinates: { x: 210, y: 533 },
  },
] as const satisfies ReadonlyArray<LocationBase>;

export type Location = (typeof localations)[number];

export default function useLocation() {
  const locationsRef = useRef([...localations]);

  function getRandomLocation(): Location {
    if (locationsRef.current.length === 0) {
      locationsRef.current = [...localations];
    }

    const randomIndex = Math.floor(Math.random() * locationsRef.current.length);
    return locationsRef.current[randomIndex];
  }

  function removeLocation(photoName: string) {
    const index = locationsRef.current.findIndex(
      (location) => location.photoName === photoName
    );
    if (index !== -1) {
      locationsRef.current.splice(index, 1);
    }
  }

  return {
    getRandomLocation: useCallback(getRandomLocation, []),
    removeLocation: useCallback(removeLocation, []),
  };
}
