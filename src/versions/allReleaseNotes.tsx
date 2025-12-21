import { Link } from "react-router-dom";
import Text from "@/components/Text";

import type { ReleaseNotes } from "./types";

const releaseNotes: ReleaseNotes = [
  {
    version: "v4.2.0",
    publishedAt: new Date("2025-12-21T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Le mode <i>Photos du jour</i> dispose désormais d'un classement{" "}
            <b>complet</b> des meilleurs joueurs&nbsp;!
            <br />
            Rendez-vous sur la page{" "}
            <Link to="/leaderboards/daily/today" viewTransition>
              des classements
            </Link>{" "}
            pour consulter le classement du jour, ainsi que ceux des jours
            précédents via un calendrier.
          </Text>
          <Text component="li">
            Lors de la création d'un album, vous pouvez maintenant filtrer vos
            photos en fonction des personnages présents dessus.
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            The <i>Daily Photos</i> mode now features a <b>complete</b> ranking
            of the best players!
            <br />
            Visit the{" "}
            <Link to="/leaderboards/daily/today" viewTransition>
              leaderboards page
            </Link>{" "}
            to view the daily ranking, as well as those from previous days via a
            calendar.
          </Text>
          <Text component="li">
            When creating an album, you can now filter your photos based on the
            characters present in them.
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v4.1.0",
    publishedAt: new Date("2025-12-12T00:00:00Z"),
    notes: {
      fr: (
        <Text>
          Les photographes peuvent désormais créer des albums pour partager
          leurs photos&nbsp;!
          <br />
          Un onglet{" "}
          <Link to="/account/albums" viewTransition>
            "Mes albums"
          </Link>{" "}
          a été ajouté sur la page "Mon compte", dans lequel vous pouvez créer
          et gérer vos albums. Sélectionnez vos meilleures photos, configurez le
          fond de votre album, donnez-lui un nom, publiez-le et
          partagez-le&nbsp;!
        </Text>
      ),
      en: (
        <Text>
          Photographers can now create albums to share their photos!
          <br />A{" "}
          <Link to="/account/albums" viewTransition>
            "My albums"
          </Link>{" "}
          tab has been added to the "My account" page where you can create and
          manage your albums. Select your best photos, set your album's
          background, give it a name, publish it, and share it!
        </Text>
      ),
    },
  },
  {
    version: "v4.0.0",
    publishedAt: new Date("2025-12-01T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Le moteur du jeu a été profondément modifié pour permettre des URLs
            dynamiques&nbsp;: pour le moment ceci n'est pas utile, mais c'est
            une étape majeure pour une future fonctionnalité à venir qui portera
            sur la création d'albums&nbsp;!
            <br />
          </Text>
          <Text component="li">
            Waluigi fait son apparition dans la liste des personnages&nbsp;! Il
            faut "casser" le jeu pour le débloquer... Y arriverez-vous&nbsp;?
          </Text>
          <Text component="li">
            Il est désormais possible d'activer depuis les préférences de son
            compte une "zone de sécurité" autour du bouton "Deviner"&nbsp;: ceci
            peut permettre d'éviter les <i>missclicks</i> avant de valider sa
            suggestion.
          </Text>
          <Text component="li">
            La date de publication des mises à jours est désormais indiquée pour
            chacune d'entre elles.
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            The game's engine has been thoroughly reworked to support dynamic
            URLs: for now this isn't particularly useful, but it's a major step
            towards a future feature that will enable albums creation!
            <br />
          </Text>
          <Text component="li">
            Waluigi has been added to the list of characters! You have to
            "break" the game to unlock him... Will you manage it?
          </Text>
          <Text component="li">
            From your account preferences, you can now enable a "safety zone"
            around the "Guess" button: this can help avoid misclicks before
            submitting your guess.
          </Text>
          <Text component="li">
            The publication date of updates is now shown for each release notes.
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.4.3",
    publishedAt: new Date("2025-11-17T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Un gros bug empêchant les joueurs de débloquer les coupes d'or a été
            trouvé. À cause de lui, certains joueurs ne pouvaient pas aller
            au-delà de la coupe d'argent...
            <br />
            Ce bug a donc été corrigé et les joueurs affectés ont obtenu la
            coupe d'or comme il se doit. Désolé pour le dérangement&nbsp;!
          </Text>
          <Text component="li">
            Plusieurs textes anglais ont également été améliorés.
          </Text>
          <Text component="li">
            Un grand merci à <b>AprilShade</b> pour son aide, ses suggestions et
            ses rapports de bugs précis&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            A major bug preventing players from unlocking gold cups was found.
            Because of it, some players couldn't get past the silver cup...
            <br />
            This bug has now been fixed and affected players were awarded the
            gold cup as they should have been. Sorry for the inconvenience!
          </Text>
          <Text component="li">
            Several English texts have also been improved.
          </Text>
          <Text component="li">
            A big thank you to <b>AprilShade</b> for their help, suggestions,
            and bug reports!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.4.2",
    publishedAt: new Date("2025-11-09T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Le mode <b>150cc</b> est désormais accessible dès le début du jeu,
            il n'est plus nécessaire de le débloquer.
          </Text>
          <Text component="li">
            Il est désormais possible de fermer la fenêtre de fin de jeu afin de
            voir où se situe la dernière photo de votre partie.
          </Text>
          <Text component="li">
            Depuis les préférences de votre compte, vous pouvez demander à
            afficher les distances en kilomètres ou en miles.
          </Text>
          <Text component="li">
            Double-cliquer sur le bouton "Afficher les circuits" lors d'une
            partie ne fait plus de zoom sur la carte.
          </Text>
          <Text component="li">
            <b>Mario Kart World Guessr</b> a maintenant <b>480</b> photos
            différentes&nbsp;! Merci à tous les photographes qui ont
            contribué&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            The <b>150cc</b> mode is now available from the start of the game
            and no longer needs to be unlocked.
          </Text>
          <Text component="li">
            It is now possible to close the end-of-game window to see where the
            last photo from your game is located.
          </Text>
          <Text component="li">
            From your account preferences, you can choose to display distances
            in kilometers or miles.
          </Text>
          <Text component="li">
            Double-clicking the "Show tracks" button during a game no longer
            zooms the map.
          </Text>
          <Text component="li">
            <b>Mario Kart World Guessr</b> now has <b>480</b> different photos!
            Thanks to all the photographers who contributed!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.4.1",
    publishedAt: new Date("2025-10-27T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            La façon de calculer la difficulté des photos a été revue. Les
            photos "faciles" devraient normalement être vraiment faciles
            désormais, et beaucoup de photos "normales" sont devenues
            "difficiles".
          </Text>
          <Text component="li">
            Le mode <b>100cc</b> est désormais accessible dès le début du jeu,
            il n'est plus nécessaire de le débloquer.
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            The way photo difficulty is calculated has been revised. "Easy"
            photos should now actually be easy, and many "normal" photos have
            become "hard".
          </Text>
          <Text component="li">
            The <b>100cc</b> mode is now available from the start of the game
            and no longer needs to be unlocked.
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.4.0",
    publishedAt: new Date("2025-10-09T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            La carte affichant le monde de <b>Mario Kart World</b> a été
            améliorée&nbsp;: il est désormais possible de zoomer dedans pour
            être plus précis&nbsp;!
          </Text>
          <Text component="li">
            Les circuits ont également été repositionnés pour être plus
            conformes à leurs emplacements dans le jeu d'origine{" "}
            <i>
              (certains étaient décalés de plusieurs dizaines de pixels quand
              même&nbsp;!)
            </i>
            .
          </Text>
          <Text component="li">
            <b>Mario Kart World Guessr</b> contient désormais plus de{" "}
            <b>410 photos</b>&nbsp;! Merci à tous les photographes qui ont
            contribué à enrichir le jeu&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            The map showing the world of <b>Mario Kart World</b> has been
            improved: you can now zoom in on it to be more precise!
          </Text>
          <Text component="li">
            Tracks have also been repositioned to better match their locations
            in the original game <i>(some were off by several dozen pixels!)</i>
            .
          </Text>
          <Text component="li">
            <b>Mario Kart World Guessr</b> now contains over <b>410 photos</b>!
            Thanks to all the photographers who helped enrich the game!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.3.0",
    publishedAt: new Date("2025-09-21T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Refonte du mode survie&nbsp;! Désormais, le score minimum à
            atteindre pour continuer la partie augmente toutes les huit photos
            jouées.
            <br />
            Ceci devrait rendre le jeu plus intéressant, surtout pour les
            difficultés les moins élevées&nbsp;!
          </Text>
          <Text component="li">
            Les classements du mode survie ont été ré-initialisés en
            conséquences. C'est le moment de se hisser au sommet&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            Survival mode revamped! From now on, the minimum score required to
            continue a run increases every eight photos played.
            <br />
            This should make the game more interesting, especially on the lower
            difficulty levels.
          </Text>
          <Text component="li">
            Survival leaderboards have been reset accordingly. Now's your chance
            to climb to the top!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.2.0",
    publishedAt: new Date("2025-09-19T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Déjà plus de trentes photos ont été proposées par les joueurs depuis
            la dernière mise à jour, merci à tout le monde&nbsp;!
            <br />
            Cette nouvelle mise à jour apporte un système de notifications pour
            permettre aux photographes de savoir quand leurs photos sont
            validées.
            <br />
            Depuis la page <b>Mon compte</b>, vous pouvez également consulter
            différentes statistiques pour chacune de vos photos : par exemple
            combien de joueurs les ont vues, ainsi que leurs suggestions.
          </Text>
          <Text component="li">
            Avec cette mise à jour apparait également un nouveau succès : vous
            débloquerez Toadette si vous parvenez à faire publier une de vos
            photos&nbsp;!
          </Text>
          <Text component="li">
            Le saviez-vous&nbsp;? <b>Mario Kart World Guessr</b> est géré par
            une seule personne, et cela représente beaucoup de travail&nbsp;!
            <br />
            Si vous appréciez le jeu et souhaitez me soutenir, vous pouvez&nbsp;
            <a
              href="https://buymeacoffee.com/mariouniversalis"
              target="_blank"
              rel="noopener noreferrer"
            >
              m'offrir un café ↗
            </a>
            . Sinon, n'hésitez pas à partager le jeu autour de vous&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            Over thirty photos have already been submitted by players since the
            last update — thank you everyone!
            <br />
            This release adds a notifications system so photographers are
            informed when their photos are validated.
            <br />
            From the <b>My account</b> page you can also view statistics for
            each of your photos: for example how many players have seen them and
            the guesses they received.
          </Text>
          <Text component="li">
            This update also introduces a new achievement: you will unlock
            Toadette if one of your photos gets published!
          </Text>
          <Text component="li">
            Did you know? <b>Mario Kart World Guessr</b> is maintained by a
            single person, and it represents a lot of work!
            <br />
            If you enjoy the game and would like to support me, you can&nbsp;
            <a
              href="https://buymeacoffee.com/mariouniversalis"
              target="_blank"
              rel="noopener noreferrer"
            >
              buy me a coffee ↗
            </a>
            . Otherwise, feel free to share the game with others!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.1.0",
    publishedAt: new Date("2025-09-07T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Appel à tous les photographes&nbsp;!
            <br />
            <b>Mario Kart World Guessr</b> a pour le moment <b>258</b> photos.
            C'est beaucoup, mais certainement pas assez pour les joueurs les
            plus chevronnés...
            <br />
            Les utilisateurs connectés peuvent désormais proposer leurs propres
            photos&nbsp;:&nbsp;n'hésitez pas à contribuer au projet&nbsp;! Le
            formulaire est accessible depuis la page d'accueil.
          </Text>
          <Text component="li">
            Un nouveau succès a également fait son apparition, associé à son
            propre personnage&nbsp;:&nbsp;rendez-vous sur la page de votre
            compte pour découvrir comment le débloquer&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            Calling all photographers!
            <br />
            <b>Mario Kart World Guessr</b> currently has <b>258</b> photos.
            That's a lot, but certainly not enough for the most seasoned
            players...
            <br />
            Logged-in users can now submit their own photos — feel free to
            contribute to the project! The submission form is available from the
            home page.
          </Text>
          <Text component="li">
            A new achievement has also been added, with its own character: visit
            your account page to find out how to unlock it!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v3.0.0",
    publishedAt: new Date("2025-08-11T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Les succès sont là&nbsp;!
            <br />
            Neuf succès sont désormais disponibles{" "}
            <b>pour les joueurs connectés</b> : huit se débloquent en gagnant
            des coupes en or et un autre en atteignant un score de 5000 points
            en une seule photo.
            <br />
            <em>
              Si vous aviez déjà des coupes en or avant cette mise à jour, les
              succès correspondants devraient être déjà débloqués&nbsp;!
            </em>
          </Text>
          <Text component="li">
            Les scores des bots ont été mis à jour pour faciliter un peu le
            déblocage des coupes.
          </Text>
          <Text component="li">
            <b>Mario Kart World Guessr</b> a plus de joueurs que prévu&nbsp;!
            Merci à vous &lt;3
            <br />
            Mais ceci a causé un problème de performances sur certaines
            fonctionnalités du site, notamment sur le calcul des médiannes des
            propositions des joueurs, qui a été temporairement désactivé.
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            Achievements are here!
            <br />
            Nine achievements are now available <b>for logged players</b>: eight
            are unlockable by winning gold cups and another by reaching a score
            of 5000 points with a single photo.
            <br />
            <em>
              If you already had gold cups before this update, the corresponding
              achievements should already be unlocked!
            </em>
          </Text>
          <Text component="li">
            Bot scores have been updated to make unlocking cups a bit easier.
          </Text>
          <Text component="li">
            <b>Mario Kart World Guessr</b> has more players than expected! Thank
            you &lt;3
            <br />
            But this has caused performance issues on some site features,
            particularly on calculating player guess medians, which has been
            temporarily disabled.
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v2.2.0",
    publishedAt: new Date("2025-07-31T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">Arrivée des classements généraux&nbsp;!</Text>
          <Text component="li">
            Vous pouvez désormais voir qui sont les meilleurs joueurs pour
            chaque mode de jeu et chaque difficulté.
            <br />
            Parviendrez-vous à atteindre le haut du classement&nbsp;?
          </Text>
          <Text component="li">
            <em>
              Notez que le mode <b>Survie</b> va connaitre des ajustements dans
              une prochaine mise à jour et son classement sera ré-initialisé en
              conséquences.
            </em>
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">General leaderboards are here!</Text>
          <Text component="li">
            You can now see who the best players are for each game mode and
            difficulty.
            <br />
            Will you manage to reach the top of the leaderboard?
          </Text>
          <Text component="li">
            <em>
              Note that the <b>Survival</b> mode will undergo adjustments in an
              upcoming update and its leaderboard will be reset accordingly.
            </em>
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v2.1.1",
    publishedAt: new Date("2025-07-18T00:00:00Z"),
    notes: {
      fr: (
        <Text component="p">
          Oups, la version précédente <b>v2.1.0</b> a cassé le mode "Photos du
          jour" !<br />
          Le jeu se bloquait et il n'était plus possible de jouer à partir de la
          deuxième photo...
          <br />
          <b>Ce problème est désormais corrigé, désolé pour le dérangement !</b>
        </Text>
      ),
      en: (
        <Text component="p">
          Oops, the previous version <b>v2.1.0</b> broke the "Daily Photos"
          mode!
          <br />
          The game would freeze and it was no longer possible to play from the
          second photo...
          <br />
          <b>This issue is now fixed, sorry for the inconvenience!</b>
        </Text>
      ),
    },
  },
  {
    version: "v2.1.0",
    publishedAt: new Date("2025-07-17T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">Ajout d'une page "Mon compte" !</Text>
          <Text component="li">
            Elle est accessible juste après la connection, ou en cliquant sur
            votre pseudo en haut de la page.
          </Text>
          <Text component="li">
            La modification de la langue du jeu se fait désormais depuis cette
            page.
          </Text>
          <Text component="li">
            Les utilisateurs connectés peuvent désormais modifier leur
            pseudonyme.
          </Text>
          <Text component="li">
            Ils peuvent également choisir entre Mario, Luigi, Peach ou Bowser
            pour les représenter.
            <br />
            <em>(d'autres personnages arriveront peut-être prochainement !)</em>
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">Added "My Account" page!</Text>
          <Text component="li">
            It is accessible right after logging in, or by clicking on your
            username at the top of the page.
          </Text>
          <Text component="li">
            Game language settings can now be changed from this page.
          </Text>
          <Text component="li">
            Logged-in users can now change their username.
          </Text>
          <Text component="li">
            They can also choose between Mario, Luigi, Peach or Bowser to
            represent them.
            <br />
            <em>(more characters might be coming soon!)</em>
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v2.0.1",
    publishedAt: new Date("2025-07-15T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">Abaissement général de la difficulté.</Text>
          <Text component="li">
            Le jeu est un peu plus généreux en points, notamment dans la
            difficulté <b>150cc</b>.
          </Text>
          <Text component="li">
            Les conditions pour débloquer la difficulté "Miroir" sont moins
            exigeantes : le but est que plus de monde puisse en profiter&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">General difficulty reduction.</Text>
          <Text component="li">
            The game is slightly more generous with points, especially in{" "}
            <b>150cc</b> difficulty.
          </Text>
          <Text component="li">
            The conditions to unlock "Mirror" difficulty are less demanding: the
            goal is for more people to enjoy it!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v2.0.0",
    publishedAt: new Date("2025-07-14T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Un classement s'affiche désormais à la fin de chaque partie,
            permettant de vous mesurer à tous les autres joueurs.
          </Text>
          <Text component="li">
            Vous pouvez désormais vous connecter via <b>Google</b> ou{" "}
            <b>Discord</b> pour apparaitre dans ce classement.
            <br />
            <i>
              Vous connecter vous permettra de sauvegarder votre
              progression&nbsp;!
            </i>
          </Text>
          <Text component="li">
            Les différents modes de difficulté doivent désormais être débloqués
            en gagnant des coupes. Battez les scores de Mario, Luigi et
            Peach&nbsp;!
          </Text>
          <Text component="li">
            La difficulté <b>Miroir</b> est maintenant disponible... si vous
            parvenez à la débloquer&nbsp;!
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            A leaderboard now appears at the end of each game, allowing you to
            compete with all other players.
          </Text>
          <Text component="li">
            You can now sign in via <b>Google</b> or <b>Discord</b> to appear in
            this leaderboard.
            <br />
            <i>Signing in will allow you to save your progress!</i>
          </Text>
          <Text component="li">
            The different difficulty modes must now be unlocked by winning cups.
            Beat Mario, Luigi and Peach's scores!
          </Text>
          <Text component="li">
            The <b>Mirror</b> difficulty is now available... if you manage to
            unlock it!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v1.1.0",
    publishedAt: new Date("2025-06-30T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">
            Les modes <b>Survie</b> et <b>Objectif : 50.000</b> ont désormais
            trois niveaux de difficulté : <b>50cc</b>, <b>100cc</b> et{" "}
            <b>150cc</b> !
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">
            <b>Survival</b> and <b>Goal: 50,000</b> modes now have three
            difficulty levels: <b>50cc</b>, <b>100cc</b> and <b>150cc</b>!
          </Text>
        </ul>
      ),
    },
  },
  {
    version: "v1.0.0",
    publishedAt: new Date("2025-06-21T00:00:00Z"),
    notes: {
      fr: (
        <ul>
          <Text component="li">Le jeu est lancé !</Text>
          <Text component="li">
            Trois modes de jeu sont disponibles : <b>Survie</b>,{" "}
            <b>Objectif : 50.000</b> et <b>Photos du jour</b>.
          </Text>
        </ul>
      ),
      en: (
        <ul>
          <Text component="li">The game is launched!</Text>
          <Text component="li">
            Three game modes are available: <b>Survival</b>, <b>Goal: 50,000</b>{" "}
            and <b>Daily Photos</b>.
          </Text>
        </ul>
      ),
    },
  },
];
export default releaseNotes;
