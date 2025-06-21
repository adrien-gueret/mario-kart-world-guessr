import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import fetchApi from "@/services/api";

export type LocationBase = {
  photoName: string;
  authorName: string;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type LocationFull = LocationBase & Coordinates;

type LocationsContextType = {
  isLoading: boolean;
  isError: boolean;
  allLocations: LocationBase[];
};

const LocationsContext = createContext<LocationsContextType>({
  isLoading: true,
  isError: false,
  allLocations: [],
} as LocationsContextType);

async function fetchLocations(): Promise<LocationBase[]> {
  const response = await fetchApi("/random-photos");

  if (!response.ok) {
    throw new Error();
  }

  return (await response.json()) as LocationBase[];
}

export function LocationsProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [allLocations, setAllLocations] = useState<LocationBase[]>([]);
  const hasCalledApi = useRef<boolean>(false);

  useEffect(() => {
    if (hasCalledApi.current) {
      return;
    }

    hasCalledApi.current = true;

    fetchLocations()
      .then((locations) => {
        setAllLocations([...locations]);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <LocationsContext
      value={{
        isLoading,
        isError,
        allLocations,
      }}
    >
      {children}
    </LocationsContext>
  );
}

export default function useLocations() {
  const context = useContext(LocationsContext);
  const locationsRef = useRef<LocationBase[]>([]);
  const [isReady, setIsReady] = useState(false);

  if (!context) {
    throw new Error("useLocations must be used within a LocationsProvider");
  }

  const { isLoading, isError, allLocations } = context;

  useEffect(() => {
    if (!isLoading) {
      locationsRef.current = [...allLocations];
      setIsReady(true);
    }
  }, [isLoading, allLocations]);

  const getRandomLocation = useCallback(() => {
    if (isLoading || isError) {
      throw new Error("Locations are still loading or an error occurred.");
    }

    if (locationsRef.current.length === 0) {
      locationsRef.current = [...allLocations];
    }

    const randomIndex = Math.floor(Math.random() * locationsRef.current.length);
    return locationsRef.current[randomIndex];
  }, [isLoading, allLocations]);

  function removeLocation(photoName: string) {
    const index = locationsRef.current.findIndex(
      (location) => location.photoName === photoName
    );
    if (index !== -1) {
      locationsRef.current.splice(index, 1);
    }
  }

  return {
    isReady,
    getRandomLocation: useCallback(getRandomLocation, []),
    removeLocation: useCallback(removeLocation, []),
  };
}
