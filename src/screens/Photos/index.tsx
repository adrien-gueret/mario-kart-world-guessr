import { useState, useEffect, useRef, type MouseEventHandler } from "react";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Text from "@/components/Text";

import fetchApi from "@/services/api";

import PhotoDetails from "./PhotoDetails";

import "./Photo.css";

export default function Photos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePhoto, setHasMorePhoto] = useState(false);
  const [areDetailsOpen, setAreDetailsOpen] = useState(false);
  const [selectedPhotoName, setSelectedPhotoName] = useState<string | null>(
    null
  );
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const currentFetchingPage = useRef(0);

  useEffect(() => {
    if (currentFetchingPage.current === currentPage) {
      return;
    }

    currentFetchingPage.current = currentPage;

    setIsLoading(true);

    fetchApi(`/get-photos?limit=20&page=${currentPage}`)
      .then(async (response) => {
        const newPhotos = await response.json();

        setPhotoNames((prev) => [
          ...prev,
          ...newPhotos.data.map(
            (photo: { photoName: string }) => photo.photoName
          ),
        ]);
        setHasMorePhoto(newPhotos.pagination.has_next);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage]);

  const selectPhotoName = (photoName: string) => {
    setSelectedPhotoName(photoName);
    setAreDetailsOpen(true);
  };

  const getHandleClick =
    (photoName: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      selectPhotoName(photoName);
    };

  const getHandleKeyDown = (photoName: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      selectPhotoName(photoName);
    }
  };

  return (
    <div className="photo-screen">
      <h2>All photos</h2>
      <Text component="p">
        Discover all <b>Mario Kart World Guessr</b> photos!
      </Text>

      {photoNames.length > 0 && (
        <ul className="photo-list">
          {photoNames.map((photoName) => (
            <li key={photoName}>
              <img
                role="button"
                draggable={false}
                tabIndex={1}
                key={photoName}
                src={`./photos/${photoName}.jpg`}
                alt=""
                loading="lazy"
                onClick={getHandleClick(photoName)}
                onKeyDown={getHandleKeyDown(photoName)}
              />
            </li>
          ))}
        </ul>
      )}

      {!isLoading && hasMorePhoto && (
        <Button
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          More
        </Button>
      )}

      {isLoading && <Loader />}

      <Modal
        title="Détails de la photo"
        isOpen={areDetailsOpen}
        disableSkew
        noDelay
      >
        {selectedPhotoName && (
          <PhotoDetails
            photoName={selectedPhotoName}
            onClose={() => {
              setAreDetailsOpen(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
