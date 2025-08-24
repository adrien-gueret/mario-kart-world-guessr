import { useTranslations } from "@/i18n";

import Button from "@/components/Button";
import ConstraintContainer from "@/components/ConstraintContainer";
import Surface from "@/components/Surface";
import Text from "@/components/Text";

import { useScreen } from "@/screens/ScreensProvider";

import "./UploadHelp.css";

function UploadHelp() {
  const { currentLocale, translate } = useTranslations();
  const { setCurrentScreenName } = useScreen();

  return (
    <div className="upload-help">
      <ConstraintContainer>
        {currentLocale === "fr" ? (
          <>
            <h2>Comment proposer une photo ?</h2>

            <Surface disableSkew>
              <Text component="p">
                Vous souhaitez proposer une photo pour{" "}
                <b>Mario Kart World Guessr</b> mais vous ne savez pas comment
                vous y prendre&nbsp;? Ce guide est fait pour vous&nbsp;!
              </Text>
            </Surface>

            <h3>1. Prendre la photo !</h3>

            <Surface disableSkew>
              <Text component="p">
                Lancez tout d'abord votre propre jeu <b>Mario Kart World</b> sur
                votre <b>Nintendo Switch 2</b>. Lancez ensuite le mode{" "}
                <b>Balade</b> et promenez-vous sur la carte.
              </Text>

              <Text component="p">
                <i>
                  Vous pouvez aussi prendre des photos en pleine courses, mais
                  il sera plus difficile pour vous de localiser précisément la
                  photo.
                </i>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/start-free-roam.jpg" alt="" />
              <figcaption>
                Baladez-vous jusqu'à trouver un endroit intéressant à prendre en
                photo.
              </figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Lorsque vous êtes satisfait de votre position, appuyez sur le
                bouton <kbd>Moins</kbd> pour entrer en mode "photo".
                <br />
                Cadrez alors votre photo comme vous le souhaitez, et testez les
                différentes poses et expressions de votre personnage pour rendre
                la photo un peu plus vivante.
                <br />
                N'hésitez pas également à zoomer ou incliner l'angle de caméra
                pour rendre la photo un peu plus difficile.
                <br />
                <b>
                  Faites cependant attention à rendre votre photo devinable
                  malgré tout&nbsp;! Une photo dont la localisation est
                  impossible à deviner sera refusée&nbsp;!
                </b>
                <br />
                <em>
                  N'hésitez pas à choisir un personnage et un kart spécifiques
                  pour votre photo, afin de donner un indice supplémentaire aux
                  joueurs sur sa localisation.
                </em>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/wrong-photo-too-zoomed.jpg" alt="" />
              <figcaption>
                Cette photo trop zoomée est presque impossible à localiser. Ce
                n'est <b>pas</b> amusant pour les joueurs et{" "}
                <b>elle sera donc refusée</b>.
              </figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Assurez-vous également de n'utiliser aucun cadre spécial, afin
                de garder une certaine homogénéité dans toutes les photos de{" "}
                <b>Mario Kart World Guessr</b>.
                <br />
                <b>
                  Notez qu'une photo avec un cadre spécial sera systématiquement
                  refusée.
                </b>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/wrong-photo-frames.jpg" alt="" />
              <figcaption>
                Cette photo utilise un cadre spécial. Pour garder une cohérence
                entre toutes les photos du jeu, <b>elle sera refusée</b>.
              </figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Une fois que vous êtes satisfait de votre photo, appuyez sur le
                bouton <kbd>Plus</kbd> pour cacher tous les textes d'aide{" "}
                <b>puis</b> appuyez sur le bouton de capture pour prendre une
                capture d'écran depuis le système natif de votre{" "}
                <b>Nintendo Switch 2</b>.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/final-photo.jpg" alt="" />
              <figcaption>
                Cette photo en montre suffisamment pour qu'elle soit
                identifiable : c'est parfait&nbsp;!
              </figcaption>
            </figure>

            <h3>2. Transférer votre photo</h3>

            <Surface disableSkew>
              <Text component="p">
                Appuyez sur le bouton <kbd>Home</kbd> pour accéder au menu
                principal de votre <b>Nintendo Switch 2</b> et ouvrez votre
                album pour y retrouver votre nouvelle photo.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/album.png" alt="" />
              <figcaption>Accédez à l'album de votre console.</figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Sélectionnez votre photo et choisissez{" "}
                <i>Envoyer sur un appareil connecté</i>. Envoyez alors votre
                photo sur les serveurs de Nintendo.
                <br />
                <b>
                  Vous avez besoin d'un compte Nintendo pour effectuer cette
                  opération.
                </b>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/send-to-device.png" alt="" />
              <figcaption>
                Envoyez votre photo vers un appareil connecté.
              </figcaption>
            </figure>
            <figure>
              <img src="./ui/upload/send-to-server.png" alt="" />
              <figcaption>
                Confirmez l'envoi vers les serveurs de Nintendo.
              </figcaption>
            </figure>

            <h3>3. Récupérer votre photo</h3>

            <Surface disableSkew>
              <Text component="p">
                Depuis votre téléphone, téléchargez l'application officielle{" "}
                <b>
                  <a
                    target="_blank"
                    href="https://www.nintendo.com/fr-fr/Hardware/Nintendo-Switch-2/Nintendo-Switch-2-Nintendo-Switch-App-2788395.html#ScreenshotsVideos"
                  >
                    Nintendo Switch App
                  </a>
                </b>{" "}
                et connectez-vous dessus avec votre compte Nintendo.
                <br />
                Rendez-vous alors dans l'album de l'application pour y retrouver
                la photo que vous avez transférée dans l'étape précédente.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/about-nintendo-switch-app.png" alt="" />
              <figcaption>
                Votre console peut vous donner plus d'informations sur
                l'application <b>Nintendo Switch App</b>.
              </figcaption>
            </figure>
            <figure>
              <img className="mobile" src="./ui/upload/app-album.jpg" alt="" />
              <figcaption>
                Accédez à votre album depuis l'application.
              </figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Sélectionnez votre photo et choisissez <i>Partager</i> pour
                pouvoir l'envoyer vers votre ordinateur (par email par exemple,
                ou via <b>AirDrop</b> si vous avez un éco-système Apple, ou
                encore via une application type <b>WhatsApp</b> en vous la
                partageant à vous-même).
              </Text>
            </Surface>

            <figure>
              <img className="mobile" src="./ui/upload/app-share.jpg" alt="" />
              <figcaption>
                Partagez votre photo depuis l'application.
              </figcaption>
            </figure>

            <h3>4. Envoyer votre photo</h3>

            <Surface disableSkew>
              <Text component="p">
                Votre photo étant maintenant disponible depuis votre ordinateur,
                vous pouvez maintenant la proposer via le formulaire de
                téléchargement de <b>Mario Kart World Guessr</b>&nbsp;!
                <br />
                Notez que{" "}
                <b>
                  seules les photos partagées via ce système seront acceptées
                </b>
                . Ceci permet d'assurer une cohérence de qualité, de taille et
                de poids entre toutes les photos du jeu.
              </Text>
            </Surface>

            <h3>5. Positionner votre photo</h3>

            <Surface disableSkew>
              <Text component="p">
                Il vous faut ensuite positionner votre photo sur la carte du
                monde de <b>Mario Kart World</b>. Essayez d'être le plus précis
                possible, mais inutile de vous prendre la tête à faire du{" "}
                <i>pixel perfect</i>. La carte du jeu n'est pas si précise que
                ça et le jeu a une certaine tolérance lorsque les joueurs font
                leurs suggestions.
              </Text>
              <Text component="p">
                Pour vous assurez un maximum de précision malgré tout, retournez
                dans le mode <b>Balade</b> de <b>Mario Kart World</b> et
                affichez la carte du jeu (avec le bouton <kbd>Y</kbd>) à
                l'endroit où vous avez pris la photo. Zoomez au maximum et
                essayez de reporter la position de votre personnage sur la carte
                de votre jeu sur celle du formulaire.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/game-map.jpg" alt="" />
              <figcaption>
                La carte de <b>Mario Kart World</b> n'est pas très précise, mais
                elle devrait suffire à vous aider à positioner votre photo
                depuis le formulaire de <b>Mario Kart World Guessr</b>.
              </figcaption>
            </figure>

            <h3>6. Valider... et attendre</h3>

            <Surface disableSkew>
              <Text component="p">
                Il ne reste plus qu'à valider le formulaire et, si vous avez
                bien respecté toutes les étapes précédentes, votre photo sera
                envoyée pour validation.
                <br />
                Sachez que cette validation est manuelle et peut prendre un peu
                de temps, alors soyez patient&nbsp;!
                <br />
                Si votre photo est validée, elle sera aussitôt visible dans le
                jeu.
              </Text>
              <Text component="p">
                Merci de votre intérêt pour <b>Mario Kart World Guessr</b> et un{" "}
                <b>grand</b> merci pour votre contribution&nbsp;!
              </Text>
            </Surface>
          </>
        ) : (
          <>
            <h2>How to submit a photo?</h2>

            <Surface disableSkew>
              <Text component="p">
                You want to submit a photo for <b>Mario Kart World Guessr</b>{" "}
                but you don't know how to do it? This guide is for you!
              </Text>
            </Surface>

            <h3>1. Take the photo!</h3>

            <Surface disableSkew>
              <Text component="p">
                First launch your own <b>Mario Kart World</b> game on your{" "}
                <b>Nintendo Switch 2</b>. Then launch the <b>Free Roam</b> mode
                and explore the map.
              </Text>

              <Text component="p">
                <i>
                  You can also take photos during races, but it will be more
                  difficult for you to precisely locate the photo.
                </i>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/start-free-roam.jpg" alt="" />
              <figcaption>
                Explore until you find an interesting place to photograph.
              </figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                When you're satisfied with your position, press the{" "}
                <kbd>Minus</kbd> button to enter "photo" mode.
                <br />
                Frame your photo as you wish, and test different poses and
                expressions of your character to make the photo more lively.
                <br />
                Don't hesitate to zoom or tilt the camera angle to make the
                photo a bit more challenging.
                <br />
                <b>
                  However, be careful to make your photo guessable nonetheless!
                  A photo whose location is impossible to guess will be
                  rejected!
                </b>
                <br />
                <em>
                  Feel free to choose a specific character and kart for your
                  photo, to give players an additional clue about its location.
                </em>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/wrong-photo-too-zoomed.jpg" alt="" />
              <figcaption>
                This photo is too zoomed in and almost impossible to locate.
                This is <b>not</b> fun for players and{" "}
                <b>it will be rejected</b>.
              </figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Also make sure not to use any special frames, to maintain
                consistency across all <b>Mario Kart World Guessr</b> photos.
                <br />
                <b>
                  Note that a photo with a special frame will be systematically
                  rejected.
                </b>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/wrong-photo-frames.jpg" alt="" />
              <figcaption>
                This photo uses a special frame. To maintain consistency between
                all game photos, <b>it will be rejected</b>.
              </figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Once you're satisfied with your photo, press the <kbd>Plus</kbd>{" "}
                button to hide all help texts <b>then</b> press the capture
                button to take a screenshot from your <b>Nintendo Switch 2</b>'s
                native system.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/final-photo.jpg" alt="" />
              <figcaption>
                This photo shows enough to be identifiable: perfect!
              </figcaption>
            </figure>

            <h3>2. Transfer your photo</h3>

            <Surface disableSkew>
              <Text component="p">
                Press the <kbd>Home</kbd> button to access your{" "}
                <b>Nintendo Switch 2</b>'s main menu and open your album to find
                your new photo.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/album.png" alt="" />
              <figcaption>Access your console's album.</figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Select your photo and choose <i>Send to Connected Device</i>.
                Then send your photo to Nintendo's servers.
                <br />
                <b>You need a Nintendo account to perform this operation.</b>
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/send-to-device.png" alt="" />
              <figcaption>Send your photo to a connected device.</figcaption>
            </figure>
            <figure>
              <img src="./ui/upload/send-to-server.png" alt="" />
              <figcaption>Confirm sending to Nintendo's servers.</figcaption>
            </figure>

            <h3>3. Retrieve your photo</h3>

            <Surface disableSkew>
              <Text component="p">
                From your phone, download the official{" "}
                <b>
                  <a
                    target="_blank"
                    href="https://www.nintendo.com/us/mobile-apps/nintendo-switch-app/#check-and-share-screenshots-and-videos"
                  >
                    Nintendo Switch App
                  </a>
                </b>{" "}
                and log in with your Nintendo account.
                <br />
                Go to the app's album to find the photo you transferred in the
                previous step.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/about-nintendo-switch-app.png" alt="" />
              <figcaption>
                Your console can give you more information about the{" "}
                <b>Nintendo Switch App</b>.
              </figcaption>
            </figure>
            <figure>
              <img className="mobile" src="./ui/upload/app-album.jpg" alt="" />
              <figcaption>Access your album from the app.</figcaption>
            </figure>

            <Surface disableSkew>
              <Text component="p">
                Select your photo and choose <i>Share</i> to send it to your
                computer (via email for example, or via <b>AirDrop</b> if you
                have an Apple ecosystem, or through an app like <b>WhatsApp</b>{" "}
                by sharing it with yourself).
              </Text>
            </Surface>

            <figure>
              <img className="mobile" src="./ui/upload/app-share.jpg" alt="" />
              <figcaption>Share your photo from the app.</figcaption>
            </figure>

            <h3>4. Submit your photo</h3>

            <Surface disableSkew>
              <Text component="p">
                With your photo now available on your computer, you can submit
                it via the <b>Mario Kart World Guessr</b> upload form!
                <br />
                Note that{" "}
                <b>only photos shared through this system will be accepted</b>.
                This ensures consistency in quality, size, and file weight
                across all game photos.
              </Text>
            </Surface>

            <h3>5. Position your photo</h3>

            <Surface disableSkew>
              <Text component="p">
                You then need to position your photo on the{" "}
                <b>Mario Kart World</b> world map. Try to be as precise as
                possible, but no need to stress about being <i>pixel perfect</i>
                . The game map isn't that precise and the game has some
                tolerance when players make their guesses.
              </Text>
              <Text component="p">
                To ensure maximum precision nonetheless, return to{" "}
                <b>Mario Kart World</b>'s <b>Free Roam</b> mode and display the
                game map (with the <kbd>Y</kbd> button) at the location where
                you took the photo. Zoom in as much as possible and try to
                transfer your character's position from your game map to the
                form's map.
              </Text>
            </Surface>

            <figure>
              <img src="./ui/upload/game-map.jpg" alt="" />
              <figcaption>
                The <b>Mario Kart World</b> map isn't very precise, but it
                should be enough to help you position your photo from the{" "}
                <b>Mario Kart World Guessr</b> form.
              </figcaption>
            </figure>

            <h3>6. Submit... and wait</h3>

            <Surface disableSkew>
              <Text component="p">
                All that's left is to submit the form and, if you've followed
                all the previous steps correctly, your photo will be sent for
                validation.
                <br />
                Know that this validation is manual and can take some time, so
                be patient!
                <br />
                If your photo is approved, it will immediately be visible in the
                game.
              </Text>
              <Text component="p">
                Thank you for your interest in <b>Mario Kart World Guessr</b>{" "}
                and a <b>big</b> thank you for your contribution!
              </Text>
            </Surface>
          </>
        )}

        <div className="back-button">
          <Button
            variant="secondary"
            onClick={() => setCurrentScreenName("Home")}
          >
            {translate("home.button")}
          </Button>

          <Button onClick={() => setCurrentScreenName("Upload")}>
            {translate("home.menu.upload.title")}
          </Button>
        </div>
      </ConstraintContainer>
    </div>
  );
}

export default UploadHelp;
