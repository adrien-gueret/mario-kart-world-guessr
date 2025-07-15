import { Fragment } from "react";
import { useTranslations } from "@/i18n";
import allReleaseNotes from "@/versions/allReleaseNotes";

import "./ReleaseNotes.css";

export default function ReleaseNotes() {
  const { currentLocale } = useTranslations();

  return (
    <div className="release-notes">
      {allReleaseNotes.map((releaseNote) => (
        <Fragment key={releaseNote.version}>
          <h2>{releaseNote.version}</h2>

          <div className="release-notes-content">
            {releaseNote.notes[currentLocale]}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
