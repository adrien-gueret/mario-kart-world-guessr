import { useState } from "react";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useTranslations } from "@/i18n";

import currentVersion from "./currentVersion";

import useReleaseNotes from "./useReleaseNotes";

import "./NewVersionModal.css";
import { useScreen } from "@/screens";

export default function NewVersionModal() {
  const { translate } = useTranslations();

  const releaseNotes = useReleaseNotes();

  const { currentScreenName, setCurrentScreenName } = useScreen();

  const [isOpen, setIsOpen] = useState(Boolean(releaseNotes));

  return (
    <Modal
      title={translate("new-version.title")(currentVersion)}
      isOpen={isOpen}
      disableSkew
      noDelay
    >
      <div className="new-version-modal-content">
        <div>{releaseNotes}</div>

        <div className="new-version-modal-actions">
          {currentScreenName !== "ReleaseNotes" && (
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                setCurrentScreenName("ReleaseNotes");
              }}
            >
              {translate("see-release-notes.label")}
            </Button>
          )}

          <Button onClick={() => setIsOpen(false)}>
            {translate("close.label")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
