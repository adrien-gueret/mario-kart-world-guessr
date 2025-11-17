import { useTranslations } from "@/i18n";
import allReleaseNotes from "@/versions/allReleaseNotes";

import Button from "@/components/Button";
import Date from "@/components/Date";
import ConstraintContainer from "@/components/ConstraintContainer";
import Surface from "@/components/Surface";

import { useScreen } from "@/screens/ScreensProvider";

export default function ReleaseNotes() {
  const { currentLocale, translate } = useTranslations();
  const { setCurrentScreenName } = useScreen();

  return (
    <ConstraintContainer>
      <h2>{translate("release-notes.title")}</h2>
      {allReleaseNotes.map((releaseNote) => (
        <div className="release-note" key={releaseNote.version}>
          <h3>{releaseNote.version}</h3>

          <Surface disableSkew>
            <Date date={releaseNote.publishedAt} />
            {releaseNote.notes[currentLocale]}
          </Surface>
        </div>
      ))}

      <div className="back-button">
        <Button onClick={() => setCurrentScreenName("Home")}>
          {translate("home.button")}
        </Button>
      </div>
    </ConstraintContainer>
  );
}
