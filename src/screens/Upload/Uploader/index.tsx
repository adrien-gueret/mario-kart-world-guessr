import { useState, useEffect, useRef } from "react";

import Surface from "@/components/Surface";

import { useTranslations } from "@/i18n";

import "./Uploader.css";

export default function Uploader({
  name,
  required = false,
}: {
  name: string;
  required?: boolean;
}) {
  const { translate } = useTranslations();

  const [preview, setPreview] = useState<{ name: string; url: string } | null>(
    null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  useEffect(() => {
    const handleDocumentDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragActive(true);
      }
    };

    const handleDocumentDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsDragActive(false);
      }
    };

    const handleDocumentDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsDragActive(false);
    };

    document.addEventListener("dragenter", handleDocumentDragEnter);
    document.addEventListener("dragleave", handleDocumentDragLeave);
    document.addEventListener("drop", handleDocumentDrop);

    return () => {
      document.removeEventListener("dragenter", handleDocumentDragEnter);
      document.removeEventListener("dragleave", handleDocumentDragLeave);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, []);

  const handleFile = (file: File) => {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    const url = URL.createObjectURL(file);
    setPreview({ name: file.name, url });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      handleFile(file);
      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      }
    }
  };

  return (
    <Surface disableSkew>
      <div
        className={`uploader-container ${isDragOver ? "drag-over" : ""} ${
          isDragActive ? "drag-active" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label>
          <img
            className="uploader-cloud"
            src="./ui/upload_cloud.png"
            draggable={false}
            alt=""
          />
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept=".jpg"
            required={required}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFile(file);
              } else {
                setPreview(null);
              }
            }}
          />
        </label>

        <div className="uploader-preview">
          {preview ? (
            <>
              <img
                className="uploader-preview-image"
                src={preview.url}
                alt={preview.name}
              />
              <span>
                {preview.name}

                <button
                  className="uploader-preview-remove"
                  aria-label={translate("uploader.preview.remove")}
                  title={translate("uploader.preview.remove")}
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                    setPreview(null);
                  }}
                >
                  <svg focusable="false" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                  </svg>
                </button>
              </span>
            </>
          ) : (
            <p>{translate("uploader.explanation")}</p>
          )}
        </div>
      </div>
    </Surface>
  );
}
