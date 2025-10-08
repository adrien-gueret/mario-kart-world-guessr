import { useState, createContext } from "react";

import { MapContainer, SVGOverlay } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Checkbox from "@/components/Checkbox";
import { useTranslations } from "@/i18n";
import type { Coordinates } from "@/types/location";
import { MAP_SIZE_IN_PIXELS } from "@/services/coordinates";

import "./Map.css";
import mapImageUrl from "./map.png";
import mapCoursesImageUrl from "./map_courses.png";
import mapImageHQUrl from "./map-hq.png";
import mapCoursesImageHQUrl from "./map_courses-hq.png";

type Props = {
  onClick?: (coordinates: Coordinates) => void;
  ref?: React.Ref<HTMLImageElement>;
  isMirrored?: boolean;
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
  children = null,
}: Props) {
  const { translate } = useTranslations();

  const [hqImageLoaded, setHqImageLoaded] = useState(false);
  const [hqCoursesImageLoaded, setHqCoursesImageLoaded] = useState(false);

  const [shouldShowCourses, setShouldShowCourses] = useState(canShowCourses);

  const bounds: L.LatLngBoundsLiteral = [
    [0, 0],
    [MAP_SIZE_IN_PIXELS.height, MAP_SIZE_IN_PIXELS.width],
  ];

  const t = isMirrored
    ? `scale(-1,1) translate(-${MAP_SIZE_IN_PIXELS.width},0)`
    : undefined;

  return (
    <>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1}
        minZoom={-1}
        maxZoom={2}
        attributionControl={false}
      >
        <SVGOverlay
          bounds={bounds}
          attributes={{
            viewBox: `0 0 ${MAP_SIZE_IN_PIXELS.width} ${MAP_SIZE_IN_PIXELS.height}`,
            preserveAspectRatio: "none",
          }}
          interactive={Boolean(onClick)}
          eventHandlers={{
            click: onClick
              ? (event) => {
                  const coordinates = {
                    x: Math.floor(event.latlng.lng),
                    y: Math.floor(MAP_SIZE_IN_PIXELS.height - event.latlng.lat),
                  };
                  onClick(coordinates);
                }
              : undefined,
          }}
        >
          <image
            href={mapImageUrl}
            x="0"
            y="0"
            width={MAP_SIZE_IN_PIXELS.width}
            height={MAP_SIZE_IN_PIXELS.height}
            {...(t ? { transform: t } : {})}
          />

          <image
            href={mapImageHQUrl}
            x="0"
            y="0"
            width={MAP_SIZE_IN_PIXELS.width}
            height={MAP_SIZE_IN_PIXELS.height}
            {...(t ? { transform: t } : {})}
            style={{ opacity: hqImageLoaded ? 1 : 0.1 }}
            onLoad={() => {
              setHqImageLoaded(true);
            }}
          />

          {shouldShowCourses && (
            <>
              <image
                href={mapCoursesImageUrl}
                x="0"
                y="0"
                width={MAP_SIZE_IN_PIXELS.width}
                height={MAP_SIZE_IN_PIXELS.height}
                {...(t ? { transform: t } : {})}
                style={{ opacity: hqCoursesImageLoaded ? 0 : 1 }}
              />

              <image
                href={mapCoursesImageHQUrl}
                x="0"
                y="0"
                width={MAP_SIZE_IN_PIXELS.width}
                height={MAP_SIZE_IN_PIXELS.height}
                {...(t ? { transform: t } : {})}
                style={{ opacity: hqCoursesImageLoaded ? 1 : 0.1 }}
                onLoad={() => {
                  setHqCoursesImageLoaded(true);
                }}
              />
            </>
          )}
        </SVGOverlay>

        {children}

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
      </MapContainer>
    </>
  );
}
