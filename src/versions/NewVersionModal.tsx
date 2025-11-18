import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "@/components/Button";
import Date from "@/components/Date";
import Modal from "@/components/Modal";
import { useTranslations } from "@/i18n";

import currentVersion from "./currentVersion";

import useReleaseNotes from "./useReleaseNotes";

import "./NewVersionModal.css";

export default function NewVersionModal() {
  const { translate } = useTranslations();

  const releaseNotes = useReleaseNotes();

  const navigate = useNavigate();
  const location = useLocation();

  // TODO: check location

  const [isOpen, setIsOpen] = useState(Boolean(releaseNotes));

  return (
    <Modal
      title={translate("new-version.title")(currentVersion.version)}
      isOpen={isOpen}
      disableSkew
      noDelay
    >
      <div className="new-version-modal-content">
        <Date date={currentVersion.publishedAt} />
        <div>{releaseNotes}</div>

        <div className="new-version-modal-actions">
          {location.pathname !== "/releaseNotes" && (
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                navigate("/releaseNotes");
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
