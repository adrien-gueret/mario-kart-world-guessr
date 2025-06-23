import { useState } from "react";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Map from "@/components/Map";
import Pin from "@/components/Pin";
import Text from "@/components/Text";
import UploadCoordinates from "@/components/UploadCoordinates";

import GoogleLoginButton from "@/auth/GoogleLoginButton";
import { useGoogleUser } from "@/auth/GoogleUserProvider";

import { type Coordinates } from "@/types/location";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import "./Upload.css";

function Upload() {
  const { logout, user } = useGoogleUser();

  const [locationCoordinates, setLocationCoordinates] = useState<{
    realCoordinates: Coordinates;
    renderedCoordinates: Coordinates;
  } | null>(null);
  const [showCourses, setShowCourses] = useState<boolean>(false);
  const [uploadErrorStatus, setUploadErrorStatus] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { translate } = useTranslations();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const photo = form.photo.files[0];
    const { x = 0, y = 0 } = locationCoordinates
      ? locationCoordinates.realCoordinates
      : {};

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

      <Text component="p">{translate("upload.description")}</Text>

      <form name="upload-form" className="upload-form" onSubmit={onSubmit}>
        <fieldset>
          <h3>{translate("upload.step1.title")}</h3>
          <Text component="p">{translate("upload.step1.info1")}</Text>
          <p>
            <i>{translate("upload.step1.info2")}</i>
          </p>

          <br />

          <input type="file" name="photo" accept=".jpg" required />
        </fieldset>

        <fieldset>
          <h3>{translate("upload.step2.title")}</h3>

          <Text component="p">{translate("upload.step2.info")}</Text>

          <label className="show-courses-label">
            <input
              type="checkbox"
              checked={showCourses}
              onChange={() => setShowCourses(!showCourses)}
            />
            {translate("upload.step2.help.label")}
          </label>

          <div style={{ position: "relative" }}>
            <Map onClick={setLocationCoordinates} withCourses={showCourses} />

            {locationCoordinates && (
              <Pin
                x={locationCoordinates.renderedCoordinates.x}
                y={locationCoordinates.renderedCoordinates.y}
                variant="mario"
                onlyHead
              />
            )}

            {locationCoordinates && (
              <UploadCoordinates
                x={locationCoordinates.realCoordinates.x}
                y={locationCoordinates.realCoordinates.y}
              />
            )}
          </div>
        </fieldset>

        <fieldset>
          <h3>{translate("upload.step3.title")}</h3>

          <Text component="p">{translate("upload.step3.info")}</Text>

          <div className="author-info">
            <p>{translate("mode.daily.description")}</p>

            {/*user ? (
              <>
                <p>{translate("upload.step3.login.info")(user.email)}</p>

                <label>
                  <input
                    type="radio"
                    name="authorName"
                    value={user.givenName}
                    defaultChecked
                  />
                  {translate("upload.step3.authorName.label")(user.givenName)}
                </label>

                <label>
                  <input type="radio" name="authorName" value={user.fullName} />
                  {translate("upload.step3.authorName.label")(user.fullName)}
                </label>

                <label>
                  <input type="radio" name="authorName" value={user.fullName} />
                  {translate("upload.step3.authorName.anonymous")}
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="shouldBeNotified"
                    defaultChecked
                  />
                  {translate("upload.step3.shouldBeNotified.label")}
                </label>

                <div className="divider">
                  <span>{translate("upload.step3.or")}</span>
                </div>

                <Button variant="secondary" onClick={logout}>
                  {translate("upload.step3.logout.label")}
                </Button>
              </>
            ) : (
              <GoogleLoginButton />
            )*/}
          </div>
        </fieldset>

        <fieldset>
          <h3>{translate("upload.step4.title")}</h3>

          <p>
            <Text>{translate("upload.step4.info")}</Text>
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

      <Modal title={translate("upload.success.title")} isOpen={isSuccess}>
        <p>
          <Text>{translate("upload.success.info")}</Text>
        </p>
        <p style={{ textAlign: "center" }}>
          <Button
            onClick={() => {
              setIsSuccess(false);
              setLocationCoordinates(null);
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
