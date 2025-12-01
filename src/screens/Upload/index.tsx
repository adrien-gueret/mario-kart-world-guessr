import { useState } from "react";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Map from "@/components/Map";
import Pin from "@/components/Pin";
import Surface from "@/components/Surface";
import Text from "@/components/Text";
import UploadCoordinates from "@/components/UploadCoordinates";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import fetchApi from "@/services/api";
import useRequiredAuth from "@/services/useRequiredAuth";

import { useScreen } from "@/screens/ScreensProvider";

import { type Coordinates } from "@/types/location";

import { useTranslations } from "@/i18n";

import Uploader from "./Uploader";

import "./Upload.css";

function Upload() {
  const { user } = useCurrentUser();
  const { setCurrentScreenName } = useScreen();

  const [locationCoordinates, setLocationCoordinates] =
    useState<Coordinates | null>(null);
  const [uploadErrorStatus, setUploadErrorStatus] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [uploaderKey, setUploaderKey] = useState<number>(0);

  const { translate } = useTranslations();

  const isAnonymous = useRequiredAuth();

  if (isAnonymous) {
    return null;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const photo = form.photo.files[0];
    const { x = 0, y = 0 } = locationCoordinates ? locationCoordinates : {};

    if (!photo || !x || !y) {
      setIsLoading(false);
      setUploadErrorStatus(1);
      return;
    }

    formData.append("photo", photo);
    formData.append("x", `${x}`);
    formData.append("y", `${y}`);

    try {
      const response = await fetchApi("/upload-photo", "POST", formData);

      if (response.ok) {
        setIsSuccess(true);
        setUploadErrorStatus(null);
        setUploaderKey((prev) => prev + 1);
        form.reset();
      } else {
        setUploadErrorStatus(response.status);
      }
    } catch (err) {
      setUploadErrorStatus(500);
    }

    setIsLoading(false);
  }

  return (
    <div className="upload-screen">
      <h2>{translate("upload.title")}</h2>

      <form name="upload-form" className="upload-form" onSubmit={onSubmit}>
        <Text component="p">{translate("upload.description")}</Text>

        <div className="upload-helper-container">
          <Surface>
            <div className="upload-helper">
              <img src="./ui/upload/need-help.png" draggable={false} alt="" />
              <Button
                onClick={() => setCurrentScreenName("UploadHelp")}
                variant="secondary"
              >
                {translate("need.help")}
              </Button>
            </div>
          </Surface>
        </div>

        <fieldset>
          <h3>{translate("upload.step1.title")}</h3>
          <Text component="p">{translate("upload.step1.info1")}</Text>

          <div style={{ marginTop: "24px" }}>
            <Uploader name="photo" required key={uploaderKey}>
              <p>
                <i>{translate("upload.step1.info2")}</i>
              </p>
            </Uploader>
          </div>
        </fieldset>

        <fieldset>
          <h3>{translate("upload.step2.title")}</h3>

          <div>
            <Text component="p">{translate("upload.step2.info")}</Text>
          </div>

          <Map
            onClick={setLocationCoordinates}
            shouldZoomOnDoubleClick
            canShowCourses
          >
            {locationCoordinates && (
              <Pin
                x={locationCoordinates.x}
                y={locationCoordinates.y}
                variant={user.marioCharacter}
                onlyHead
                onDragEnd={setLocationCoordinates}
              />
            )}

            {locationCoordinates && (
              <UploadCoordinates
                coordinates={locationCoordinates}
                onChange={setLocationCoordinates}
              />
            )}
          </Map>
        </fieldset>

        <fieldset>
          <h3>{translate("upload.step3.title")}</h3>

          <p>
            <Text>{translate("upload.step3.info")}</Text>
          </p>

          <Button
            type="submit"
            style={{
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            {translate("upload.form.submit.label")}
          </Button>
        </fieldset>
      </form>

      <Modal
        title={translate("upload.error")}
        isOpen={uploadErrorStatus !== null}
        noDelay
      >
        <p>
          {(() => {
            switch (uploadErrorStatus) {
              case 1:
                return <Text>{translate("upload.error.missingFields")}</Text>;
              case 400:
                return <Text>{translate("upload.error.invalidPhoto")}</Text>;
              default:
                return <Text>{translate("upload.error.serverError")}</Text>;
            }
          })()}
        </p>

        <p style={{ textAlign: "center" }}>
          <Button onClick={() => setUploadErrorStatus(null)}>OK</Button>
        </p>
      </Modal>

      <Modal title={translate("upload.loading.title")} isOpen={isLoading}>
        <p>
          <Text>{translate("upload.loading.info")}</Text>
        </p>
        <Loader />
      </Modal>

      <Modal
        title={translate("upload.success.title")}
        isOpen={isSuccess}
        noDelay
      >
        <p>
          <Text>{translate("upload.success.info")}</Text>
        </p>
        <p style={{ textAlign: "center" }}>
          <Button
            onClick={() => {
              setIsSuccess(false);
              setLocationCoordinates(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            OK
          </Button>
        </p>
      </Modal>
    </div>
  );
}

export default Upload;
