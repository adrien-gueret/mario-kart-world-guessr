import { useTranslations } from "@/i18n";

import Photo from "../Photo";
import Modal from "../Modal";

import type { HitPhoto } from ".";
import Button from "../Button";

type Props = {
  photo: HitPhoto | null;
  onClose: () => void;
};

export default function PhotoDetailsModal({ photo, onClose }: Props) {
  const { translate } = useTranslations();

  if (!photo) {
    return null;
  }

  return (
    <Modal
      title={translate("all-photos.details.title")}
      isOpen
      onClose={onClose}
      disableSkew
      noDelay
    >
      <div
        style={{
          maxWidth: "1024px",
          minWidth: "300px",
        }}
      >
        <Photo
          author={photo.author}
          photoName={photo.id}
          minWidth={300}
          minHeight={300}
        />
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Button variant="secondary" onClick={onClose}>
            {translate("close.label")}
          </Button>
        </p>
      </div>
    </Modal>
  );
}
