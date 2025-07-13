import { useState } from "react";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useTranslations } from "@/i18n";

import currentVersion from "./currentVersion";

import useReleaseNotes from "./useReleaseNotes";

import "./NewVersionModal.css";

export default function NewVersionModal() {
  const { translate } = useTranslations();

  const releaseNotes = useReleaseNotes();
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

        <div style={{ textAlign: "center" }}>
          <Button onClick={() => setIsOpen(false)}>
            {translate("close.label")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
