import { useState, useRef, useLayoutEffect, type CSSProperties } from "react";

import { MapContainer, SVGOverlay, ZoomControl } from "react-leaflet";
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
  children?:
    | React.ReactNode
    | ((bounds: L.LatLngBoundsLiteral) => React.ReactNode);
  flyTo?: Coordinates | null;
  shouldZoomOnDoubleClick?: boolean;
  size?: {
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
  } | null;
};

export default function Map({
  onClick,
  canShowCourses = false,
  isMirrored = false,
  children = null,
  flyTo = null,
  shouldZoomOnDoubleClick = false,
  size = null,
}: Props) {
  const { translate } = useTranslations();
  const mapRef = useRef<L.Map>(null);
  const dblClickClock = useRef<number | null>(null);

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

  useLayoutEffect(() => {
    if (flyTo) {
      mapRef.current?.flyTo([MAP_SIZE_IN_PIXELS.height - flyTo.y, flyTo.x], 1, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [flyTo]);

  return (
    <div
      onMouseMove={() => {
        mapRef.current?.scrollWheelZoom.enable();
      }}
      onMouseLeave={() => {
        mapRef.current?.scrollWheelZoom.disable();
      }}
      className="map-container"
      style={
        {
          ...(size?.width ? { "--map-width": size.width } : {}),
          ...(size?.height ? { "--map-height": size.height } : {}),
        } as React.CSSProperties
      }
    >
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1}
        minZoom={-1}
        maxZoom={2}
        attributionControl={false}
        ref={mapRef}
        zoomControl={false}
        doubleClickZoom={shouldZoomOnDoubleClick}
      >
        <ZoomControl position="topright" />
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
                  if (event.originalEvent.detail === 2) {
                    window.clearTimeout(dblClickClock.current!);
                    return;
                  }

                  dblClickClock.current = window.setTimeout(
                    () => {
                      const coordinates = {
                        x: Math.floor(event.latlng.lng),
                        y: Math.floor(
                          MAP_SIZE_IN_PIXELS.height - event.latlng.lat
                        ),
                      };
                      onClick(coordinates);
                    },
                    shouldZoomOnDoubleClick ? 200 : 0
                  );
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

        {typeof children === "function" ? children(bounds) : children}

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
    </div>
  );
}
