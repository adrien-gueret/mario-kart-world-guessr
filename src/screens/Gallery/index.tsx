import { useState } from "react";

import AllPhotosList, { type HitPhoto } from "@/components/AllPhotosList";
import PhotoDetailsModal from "@/components/AllPhotosList/PhotoDetailsModal";
import CharacterMenu from "@/components/CharacterMenu";
import Text from "@/components/Text";
import { useTranslations } from "@/i18n";
import SearchProvider from "@/search/SearchProvider";

export default function AllPhotos() {
  const { translate } = useTranslations();
  const [selectedPhoto, setSelectedPhoto] = useState<HitPhoto | null>(null);

  return (
    <div className="photo-screen">
      <h2>{translate("all-photos.title")}</h2>

      <div style={{ marginBottom: "1rem" }}>
        <Text component="p">{translate("all-photos.description")}</Text>
      </div>

      <SearchProvider hitsPerPage={100}>
        <CharacterMenu />
        <AllPhotosList onPhotoClick={setSelectedPhoto} />
      </SearchProvider>

      <PhotoDetailsModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
