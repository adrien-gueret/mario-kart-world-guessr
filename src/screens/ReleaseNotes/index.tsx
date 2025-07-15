import { useTranslations } from "@/i18n";
import allReleaseNotes from "@/versions/allReleaseNotes";

import Button from "@/components/Button";
import Surface from "@/components/Surface";

import { useScreen } from "@/screens/ScreensProvider";

import "./ReleaseNotes.css";

export default function ReleaseNotes() {
  const { currentLocale, translate } = useTranslations();
  const { setCurrentScreenName } = useScreen();

  return (
    <div className="release-notes">
      <h2>Notes de versions</h2>
      {allReleaseNotes.map((releaseNote) => (
        <div className="release-note" key={releaseNote.version}>
          <h3>{releaseNote.version}</h3>

          <Surface>{releaseNote.notes[currentLocale]}</Surface>
        </div>
      ))}

      <Button onClick={() => setCurrentScreenName("Title")}>
        {translate("home.button")}
      </Button>
    </div>
  );
}
