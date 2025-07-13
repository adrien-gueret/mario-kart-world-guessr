import { useTranslations } from "@/i18n";

import Text from "../../components/Text";

import "./TermsServices.css";

function TermsServices() {
  const { currentLocale } = useTranslations();

  return (
    <div className="terms-services">
      {currentLocale === "fr" ? (
        <>
          <h2>Conditions Générales d'Utilisation</h2>

          <Text component="p">Dernière mise à jour : 10 juillet 2025</Text>

          <h3>1. Présentation</h3>
          <Text component="p">
            <strong>Mario Kart World Guessr</strong> est un jeu de localisation
            dans l'univers de <strong>Mario Kart World</strong>, édité par{" "}
            <strong>Mario Universalis</strong>.
          </Text>

          <h3>2. Acceptation des conditions</h3>
          <Text component="p">
            L'utilisation de l'application implique l'acceptation pleine et
            entière des présentes Conditions Générales d'Utilisation (CGU). Si
            vous n'acceptez pas ces conditions, veuillez ne pas utiliser
            l'application.
          </Text>

          <h3>3. Utilisation de l'application</h3>
          <ul>
            <Text component="li">
              Le jeu est réservé à un usage personnel, non commercial.
            </Text>
            <Text component="li">
              L'utilisateur s'engage à ne pas publier de contenu inapproprié,
              illégal ou protégé par des droits d'auteur sans autorisation.
            </Text>
            <Text component="li">
              Toute tentative de triche, d'exploitation de bugs ou d'utilisation
              frauduleuse pourra entraîner la suspension ou la suppression du
              compte.
            </Text>
          </ul>

          <h3>4. Propriété intellectuelle</h3>
          <Text component="p">
            Les éléments relatifs à l'univers Mario Kart restent la propriété de
            Nintendo. Les contributions des utilisateurs (photos, descriptions,
            etc.) sont utilisées uniquement dans le cadre du jeu. Vous conservez
            la propriété de vos photos, mais en les envoyant, vous autorisez
            leur utilisation dans l'application.
          </Text>

          <h3>5. Responsabilités</h3>
          <ul>
            <Text component="li">
              L'éditeur ne saurait être tenu responsable des dommages directs ou
              indirects liés à l'utilisation du jeu.
            </Text>
            <Text component="li">
              L'utilisateur est responsable de ses actions et des contenus qu'il
              partage.
            </Text>
          </ul>

          <h3>6. Modération</h3>
          <Text component="p">
            L'équipe se réserve le droit de supprimer tout contenu jugé
            inapproprié ou contraire aux règles, sans préavis.
          </Text>

          <h3>7. Modification des CGU</h3>
          <Text component="p">
            Les présentes conditions peuvent être modifiées à tout moment. Les
            utilisateurs seront informés en cas de changement important.
            L'utilisation continue de l'application vaut acceptation des
            nouvelles conditions.
          </Text>

          <h3>8. Données personnelles</h3>
          <Text component="p">
            Pour en savoir plus sur la gestion de vos données, veuillez
            consulter la page « Règles de confidentialité ».
          </Text>

          <h3>9. Contact</h3>
          <Text component="p">
            Pour toute question, contactez <strong>KorHosik</strong> via les
            comptes X ou BlueSky de <strong>Mario Universalis</strong>, indiqués
            en bas de page.
          </Text>
        </>
      ) : (
        <>
          <h2>Terms of Service</h2>

          <Text component="p">Last update: July 10, 2025</Text>

          <h3>1. Overview</h3>
          <Text component="p">
            <strong>Mario Kart World Guessr</strong> is a location-based game in
            the <strong>Mario Kart World</strong> universe, published by{" "}
            <strong>Mario Universalis</strong>.
          </Text>

          <h3>2. Acceptance of Terms</h3>
          <Text component="p">
            Use of the application implies full acceptance of these Terms of
            Service (ToS). If you do not agree to these terms, please do not use
            the app.
          </Text>

          <h3>3. Use of the Application</h3>
          <ul>
            <Text component="li">
              The game is for personal, non-commercial use only.
            </Text>
            <Text component="li">
              Users agree not to submit inappropriate, illegal, or
              copyright-protected content without authorization.
            </Text>
            <Text component="li">
              Any attempt at cheating, exploiting bugs, or fraudulent use may
              result in account suspension or deletion.
            </Text>
          </ul>

          <h3>4. Intellectual Property</h3>
          <Text component="p">
            Elements related to the Mario Kart universe remain the property of
            Nintendo. User contributions (photos, descriptions, etc.) are only
            used within the game. You retain ownership of your photos, but by
            submitting them, you authorize their use in the application.
          </Text>

          <h3>5. Liability</h3>
          <ul>
            <Text component="li">
              The publisher is not responsible for any direct or indirect
              damages related to the use of the game.
            </Text>
            <Text component="li">
              Users are responsible for their actions and the content they
              share.
            </Text>
          </ul>

          <h3>6. Moderation</h3>
          <Text component="p">
            The team reserves the right to remove any content deemed
            inappropriate or contrary to the rules, without notice.
          </Text>

          <h3>7. Changes to the Terms</h3>
          <Text component="p">
            These terms may be modified at any time. Users will be notified in
            the event of significant changes. Continued use of the application
            implies acceptance of the new terms.
          </Text>

          <h3>8. Personal Data</h3>
          <Text component="p">
            For more information on data management, please consult the “Privacy
            Policy” page.
          </Text>

          <h3>9. Contact</h3>
          <Text component="p">
            For any questions, contact <strong>KorHosik</strong> via the X or
            BlueSky accounts of <strong>Mario Universalis</strong>, listed at
            the bottom of the page.
          </Text>
        </>
      )}
    </div>
  );
}

export default TermsServices;
