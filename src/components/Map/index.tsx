import {
  useState,
  type MouseEvent,
  useLayoutEffect,
  createContext,
  useRef,
} from "react";

import Checkbox from "@/components/Checkbox";
import { useTranslations } from "@/i18n";
import type { Coordinates } from "@/types/location";
import { getCoordinatesFromImage } from "@/services/coordinates";

import "./Map.css";
import mapImageUrl from "./map.png";
import mapCoursesImageUrl from "./map_courses.png";

type Props = {
  onClick?: (coordinates: {
    realCoordinates: Coordinates;
    renderedCoordinates: { x: number; y: number };
  }) => void;
  ref?: React.Ref<HTMLImageElement>;
  isMirrored?: boolean;
  onLoad?: () => void;
  canShowCourses?: boolean;
  children?: React.ReactNode;
};

type MapContextType = {
  ratio: number;
  isMirrored: boolean;
};

export const MapContext = createContext<MapContextType>({
  ratio: 1,
} as MapContextType);

export default function Map({
  onClick,
  canShowCourses = false,
  isMirrored = false,
  onLoad,
  children = null,
}: Props) {
  const { translate } = useTranslations();
  const imgRef = useRef<HTMLImageElement>(null);

  const [ratio, setRatio] = useState(1);
  const [shouldShowCourses, setShouldShowCourses] = useState(false);
  const handleMapClick = (event: MouseEvent<HTMLImageElement>) => {
    const coordinates = getCoordinatesFromImage(event.currentTarget, {
      x: event.clientX,
      y: event.clientY,
    });

    onClick?.(coordinates);
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad?.();
    const imageElement = event.currentTarget;
    setRatio(imageElement.naturalWidth / imageElement.width);
  };

  useLayoutEffect(() => {
    const onResize = () => {
      if (!imgRef.current) {
        return;
      }
      const imageElement = imgRef.current;
      setRatio(imageElement.naturalWidth / imageElement.width);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {canShowCourses && (
        <div className="map-show-courses-container">
          <Checkbox
            name="map-show-courses"
            label={translate("upload.step2.help.label")}
            checked={shouldShowCourses}
            onChange={setShouldShowCourses}
          />
        </div>
      )}

      <div className={`map-container ${isMirrored ? "mirrored" : ""}`}>
        <img
          ref={imgRef}
          draggable={false}
          className={`game-map ${onClick ? "" : " no-interaction"}`}
          src={mapImageUrl}
          alt="Game Map"
          onClick={onClick ? handleMapClick : void 0}
          onLoad={handleLoad}
        />

        {shouldShowCourses && (
          <img
            draggable={false}
            className="game-map-courses"
            style={{ pointerEvents: "none" }}
            src={mapCoursesImageUrl}
            alt=""
          />
        )}

        <MapContext value={{ ratio, isMirrored }}>{children}</MapContext>
      </div>
    </>
  );
}
