import  { useState } from "react";

import Button from "@/components/Button";
import Map from "@/components/Map";
import Pin from "@/components/Pin";
import Text from "@/components/Text";
import UploadCoordinates from "@/components/UploadCoordinates";

import  { type LocationBase } from "@/data/locations";

import { useTranslations } from "@/i18n";

import { bottomCenterTopTopLeft } from "@/services/coordinatesTransformer";

import "./Upload.css";

function Upload() {
  const [locationCoordinates, setLocationCoordinates] = useState<{
    realCoordinates: LocationBase["coordinates"];
    renderedCoordinates: LocationBase["coordinates"];
  } | null>(null);
  const [showCourses, setShowCourses] = useState<boolean>(false);

  const pinCoordinates = locationCoordinates ? bottomCenterTopTopLeft(locationCoordinates.renderedCoordinates) : null;

 // const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const photo = form.photo.files[0];
    const { x = 0, y = 0 } = locationCoordinates ? locationCoordinates.realCoordinates : {};

    if (!photo || !x || !y) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    formData.append("photo", photo);
    formData.append("x", `${x}`);
    formData.append("y", `${y}`);

    try {
      const response = await fetch("./api/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Photo envoyée avec succès !\nPR : " + result.pull_request_url);
      } else {
        alert("Erreur : " + (result.message || response.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur réseau s’est produite.");
    }
  }

  return (
    <div className="upload-screen">
      <h2>{translate("upload.title")}</h2>

      <Text component="p">{translate("upload.description")}</Text>

      <form name="upload-form" className="upload-form" onSubmit={onSubmit}>

        <fieldset>
          <h3>1. Sélectionnez votre photo</h3>
          <Text component="p">Elle doit obligatoirement provenir de l'application <b>Nintendo Switch App</b>.</Text>
          <p>
            <i>Notez que votre photo passera une étape de validation avant d'être visible dans le jeu.</i>
          </p>

          <br />

          <input type="file" name="photo" accept=".jpg" required />
        </fieldset>
      
        <fieldset>
          <h3>2. Où avez-vous pris cette photo ?</h3>

          <Text component="p">Cliquez sur la carte pour indiquer l'emplacement de votre photo.<br />
          Soyez le plus précis possible !</Text> 

          <label className="show-courses-label">
            <input type="checkbox" checked={showCourses} onChange={() => setShowCourses(!showCourses)} />
            Afficher les circuits et les routes
          </label>

          <div style={{ position: "relative" }}>
            <Map
              onClick={setLocationCoordinates}
              withCourses={showCourses}
            />

            {pinCoordinates && (
              <Pin
                x={pinCoordinates.x}
                y={pinCoordinates.y}
                variant="mario"
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
        
        <div>
          <p>
            <i>En envoyant votre photo, vous acceptez que celle-ci soit utilisée dans le jeu.</i>
          </p>

          <Button type="submit">{translate("upload.form.submit.label")}</Button>
        </div>
      </form>
    </div>
  );
}

export default Upload;
