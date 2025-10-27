import Text from "@/components/Text";

import type { ReleaseNotes } from "./types";

const releaseNotes: ReleaseNotes = [
  {
    version: "v3.4.1",
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
