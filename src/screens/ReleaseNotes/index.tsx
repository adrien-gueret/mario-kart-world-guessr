import useNavigate from "@/services/useNavigate";

import { useTranslations } from "@/i18n";
import allReleaseNotes from "@/versions/allReleaseNotes";

import Button from "@/components/Button";
import Date from "@/components/Date";
import ConstraintContainer from "@/components/ConstraintContainer";
import Surface from "@/components/Surface";

export default function ReleaseNotes() {
  const { currentLocale, translate } = useTranslations();
  const navigate = useNavigate();

  return (
    <ConstraintContainer>
      <h2>{translate("release-notes.title")}</h2>
      {allReleaseNotes.map((releaseNote) => (
        <div className="release-note" key={releaseNote.version}>
          <h3>{releaseNote.version}</h3>

          <Surface disableSkew>
            <Date date={releaseNote.publishedAt} />
            <div style={{ textAlign: "left" }}>
              {releaseNote.notes[currentLocale]}
            </div>
          </Surface>
        </div>
      ))}

      <div className="back-button">
        <Button onClick={() => navigate("/")}>
          {translate("home.button")}
        </Button>
      </div>
    </ConstraintContainer>
  );
}
