import { useTranslations } from "@/i18n";

import Surface from "@/components/Surface";
import Text from "@/components/Text";

import "./PrivacyPolicies.css";

function PrivacyPolicies() {
  const { currentLocale } = useTranslations();

  return (
    <div className="privacy-policies">
      {currentLocale === "fr" ? (
        <>
          <h2>Règles de Confidentialité</h2>

          <Text component="p">Dernière mise à jour : 10 juillet 2025</Text>

          <h3>1. Introduction</h3>

          <Surface>
            <Text component="p">
              Bienvenue sur <strong>Mario Kart World Guessr</strong> ! Cette
              page vous explique quelles informations sont collectées lorsque
              vous utilisez notre application, comment elles sont utilisées, et
              quels sont vos droits.
            </Text>
          </Surface>

          <h3>2. Quelles données sont collectées ?</h3>

          <Surface>
            <Text component="p">
              Seules les informations nécessaires au bon fonctionnement du jeu
              sont collectées, notamment :
            </Text>

            <ul>
              <Text component="li">
                <strong>Informations de compte</strong> : adresse e-mail,
                pseudo, identifiant unique.
              </Text>
              <Text component="li">
                <strong>Données des jeux</strong> : chaque tentative de
                localisation d'une photo est stockée, dans le but de proposer un
                classement et de permettre aux joueurs de comparer leurs
                résultats.
              </Text>
              <Text component="li">
                <strong>Photos géolocalisées</strong> : lorsque vous proposez
                une photo pour le jeu, elle est bien entendu stockée, ainsi que
                sa localisation que vous indiquez. Votre identifiant utilisateur
                est associé à cette photo.
              </Text>
            </ul>

            <Text component="p">
              <strong>Aucune</strong> information sensible ni données non
              nécessaires au fonctionnement du jeu ne sont collectées.
            </Text>
          </Surface>

          <h3>3. Comment vos données sont-elles utilisées ?</h3>

          <Surface>
            <Text component="p">
              Les données collectées servent uniquement à :
            </Text>

            <ul>
              <Text component="li">
                Permettre le déroulement du jeu (ex : proposer des photos aux
                joueurs, afficher un classement etc.).
              </Text>
              <Text component="li">
                Garantir la sécurité et la qualité du service (ex : modération
                des photos).
              </Text>
              <Text component="li">
                Gérer votre compte et votre progression (si vous avez créé un
                compte).
              </Text>
            </ul>

            <Text component="p">
              Vos données <strong>ne sont pas vendues</strong> à des tiers.
            </Text>
          </Surface>

          <h3>4. Où sont stockées vos données ?</h3>

          <Surface>
            <Text component="p">
              Les photos et informations liées sont stockées de façon sécurisée
              sur le serveur de <strong>Mario Universalis</strong>.<br />
              Les photos en cours de validations sont stockées sur un repo
              GitHub privé.
            </Text>
          </Surface>

          <h3>5. Partage de vos données</h3>

          <Surface>
            <Text component="p">
              Vos données personnelles ne sont pas partagées avec des tiers.
            </Text>
          </Surface>

          <h3>6. Combien de temps sont conservées vos données ?</h3>
          <Surface>
            <Text component="p">
              Vos données sont conservées aussi longtemps que nécessaire pour le
              fonctionnement du jeu.
            </Text>
          </Surface>

          <h3>7. Vos droits</h3>

          <Surface>
            <Text component="p">Vous pouvez :</Text>

            <ul>
              <Text component="li">Demander l'accès à vos données.</Text>
              <Text component="li">
                Demander la modification ou la suppression de vos données.
              </Text>
            </ul>

            <Text component="p">
              Pour toute demande, contactez <strong>KorHosik</strong> via les
              comptes X ou BlueSky de <strong>Mario Universalis</strong>,
              indiqués en bas de page.
            </Text>
          </Surface>

          <h3>8. Modifications de la politique</h3>

          <Surface>
            <Text component="p">
              Cette politique de confidentialité peut être modifiée à tout
              moment. Les utilisateurs seront informés en cas de changement
              important.
            </Text>
          </Surface>

          <h3>9. Consentement</h3>
          <Surface>
            <Text component="p">
              En utilisant l'application{" "}
              <strong>Mario Kart World Guessr</strong>, vous acceptez cette
              politique de confidentialité.
            </Text>
          </Surface>
        </>
      ) : (
        <>
          <h2>Privacy Policy</h2>

          <Text component="p">Last update: July 10, 2025</Text>

          <h3>1. Introduction</h3>

          <Surface>
            <Text component="p">
              Welcome to <strong>Mario Kart World Guessr</strong>! This page
              explains what information is collected when you use our
              application, how it is used, and what your rights are.
            </Text>
          </Surface>

          <h3>2. What data is collected?</h3>

          <Surface>
            <Text component="p">
              Only the information necessary for the proper functioning of the
              game is collected, including:
            </Text>

            <ul>
              <Text component="li">
                <strong>Account information</strong>: email address, username,
                unique identifier.
              </Text>
              <Text component="li">
                <strong>Game data</strong>: each attempt to locate a photo is
                stored, in order to provide a ranking and allow players to
                compare their results.
              </Text>
              <Text component="li">
                <strong>Geolocated photos</strong>: when you submit a photo for
                the game, it is of course stored, as well as its location that
                you indicate. Your user identifier is associated with this
                photo.
              </Text>
            </ul>

            <Text component="p">
              <strong>No</strong> sensitive information or data unnecessary for
              the game's operation is collected.
            </Text>
          </Surface>

          <h3>3. How is your data used?</h3>

          <Surface>
            <Text component="p">The collected data is used only to:</Text>

            <ul>
              <Text component="li">
                Enable the game to run (e.g.: provide photos to players, display
                rankings, etc.).
              </Text>
              <Text component="li">
                Ensure the security and quality of the service (e.g.: photo
                moderation).
              </Text>
              <Text component="li">
                Manage your account and your progress (if you have created an
                account).
              </Text>
            </ul>

            <Text component="p">
              Your data is <strong>not sold</strong> to third parties.
            </Text>
          </Surface>

          <h3>4. Where is your data stored?</h3>

          <Surface>
            <Text component="p">
              Photos and related information are stored securely on the{" "}
              <strong>Mario Universalis</strong> server.
              <br />
              Photos pending validation are stored on a private GitHub
              repository.
            </Text>
          </Surface>

          <h3>5. Sharing of your data</h3>

          <Surface>
            <Text component="p">
              Your personal data is not shared with third parties.
            </Text>
          </Surface>

          <h3>6. How long is your data kept?</h3>

          <Surface>
            <Text component="p">
              Your data is kept as long as necessary for the operation of the
              game.
            </Text>
          </Surface>

          <h3>7. Your rights</h3>

          <Surface>
            <Text component="p">You can:</Text>

            <ul>
              <Text component="li">Request access to your data.</Text>
              <Text component="li">
                Request modification or deletion of your data.
              </Text>
            </ul>

            <Text component="p">
              For any request, contact <strong>KorHosik</strong> via the X or
              BlueSky accounts of <strong>Mario Universalis</strong>, listed at
              the bottom of the page.
            </Text>
          </Surface>

          <h3>8. Policy modifications</h3>

          <Surface>
            <Text component="p">
              This privacy policy may be modified at any time. Users will be
              informed in case of significant changes.
            </Text>
          </Surface>

          <h3>9. Consent</h3>

          <Surface>
            <Text component="p">
              By using the <strong>Mario Kart World Guessr</strong> application,
              you accept this privacy policy.
            </Text>
          </Surface>
        </>
      )}
    </div>
  );
}

export default PrivacyPolicies;
