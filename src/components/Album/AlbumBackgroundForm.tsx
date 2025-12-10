import { useState, type CSSProperties } from "react";

import { useTranslations } from "@/i18n";
import type { AlbumBackgroundImage } from "@/types/photos";

import ColorPicker from "../ColorPicker";
import ValidIcon from "../Icon/Valid";
import Form from "../Form";
import "./AlbumBackgroundForm.css";

const availableBackgroundImages: AlbumBackgroundImage[] = [
  "stickers",
  "debris",
  "squares",
  "food",
  "checkerboard",
  "dots",
  "waves",
  "tires",
  "wood",
];

type Props = {
  albumId: number;
  onCancel: () => void;
  onSuccess: (newImage: AlbumBackgroundImage, newColor: string) => void;
  defaultImage?: AlbumBackgroundImage;
  defaultColor?: string;
};

export default function AlbumBackgroundForm({
  albumId,
  onCancel,
  onSuccess,
  defaultImage = "stickers",
  defaultColor = "#ffffff00",
}: Props) {
  const { translate } = useTranslations();
  const [backgroundImage, setBackgroundImage] = useState(defaultImage);
  const [backgroundColor, setBackgroundColor] = useState(defaultColor);

  const albumStyle: CSSProperties & Record<`--${string}`, string> = {
    ["--album-color"]: backgroundColor,
    ["--album-image"]: `url("./backgrounds/albums/${backgroundImage}.jpg")`,
  };

  return (
    <Form
      action="/update-album-background"
      method="PATCH"
      submitLabel={translate("global.apply")}
      successMessage={translate("album.edit.background.success")}
      onCancel={onCancel}
      onSuccess={() => {
        onSuccess(backgroundImage, backgroundColor);
      }}
    >
      <input type="hidden" name="albumId" value={albumId} />
      <fieldset>
        <legend>{translate("album.edit.background.pattern")}</legend>
        <div className="pattern-container">
          <input
            type="hidden"
            name="albumBackgroundImage"
            value={backgroundImage}
          />
          {availableBackgroundImages.map((bgImage) => {
            const isSelected = bgImage === backgroundImage;
            return (
              <button
                key={bgImage}
                type="button"
                tabIndex={isSelected ? -1 : 0}
                className={`album-background-button ${bgImage} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => setBackgroundImage(bgImage)}
                style={{
                  backgroundImage: `url("./backgrounds/albums/${bgImage}.jpg")`,
                }}
              >
                {isSelected && (
                  <span className="album-photo-selected-badge">
                    <ValidIcon width="24px" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>{translate("album.edit.background.color")}</legend>
        <ColorPicker
          id="album-background-color"
          name="albumBackgroundColor"
          label={translate("account.albums.background.color")}
          defaultValue={backgroundColor}
          onChange={setBackgroundColor}
        />
      </fieldset>

      <fieldset>
        <legend>{translate("album.edit.background.preview")}</legend>
        <div
          className="album-container background-preview"
          style={albumStyle}
        />
      </fieldset>
    </Form>
  );
}
