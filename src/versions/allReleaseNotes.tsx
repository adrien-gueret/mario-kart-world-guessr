import Text from "@/components/Text";

import type { ReleaseNotes } from "./types";

const releaseNotes: ReleaseNotes = [
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
              Votre progression depuis le 11 Juillet devrait être sauvegardée,
              si tout se passe bien !
            </i>
          </Text>
          <Text component="li">
            Les différents modes de difficulté doivent désormais être débloqués
            en gagnant des coupes. Battez les scores de Mario, Luigi et Peach !
          </Text>
          <Text component="li">
            La difficulté <b>Miroir</b> est maintenant disponible... si vous
            parvenez à la débloquer !
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
            <i>
              Your progress since July 11th should be saved, if everything goes
              well!
            </i>
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
];
export default releaseNotes;
