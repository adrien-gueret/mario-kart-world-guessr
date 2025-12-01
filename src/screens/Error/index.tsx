import { useEffect, useRef } from "react";
import { useLocation, useRouteError } from "react-router-dom";
import Button from "@/components/Button";
import ConstraintContainer from "@/components/ConstraintContainer";
import Text from "@/components/Text";

import fetchApi from "@/services/api";
import useNavigate from "@/services/useNavigate";
import { useTranslations } from "@/i18n";

type ErrorScreenProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonTarget?: string;
  imageUrl?: string;
};

export default function ErrorScreen({
  title,
  description,
  buttonLabel,
  buttonTarget = "/",
  imageUrl = "./ui/toad_oopsy.png",
}: ErrorScreenProps) {
  const hasTrackedRef = useRef(false);
  const location = useLocation();
  const error = useRouteError();

  useEffect(() => {
    if (hasTrackedRef.current || import.meta.env.DEV) {
      return;
    }

    hasTrackedRef.current = true;

    const formData = new FormData();
    formData.append("pathname", location.pathname);
    formData.append(
      "errorContent",
      error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : "{}"
    );

    fetchApi("/track-error", "POST", formData);
  }, [error, location.pathname]);
  const navigate = useNavigate();
  const { translate } = useTranslations();

  return (
    <ConstraintContainer>
      <div
        style={{
          textAlign: "center",
          marginTop: "64px",
          gap: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={imageUrl} alt="" aria-hidden="true" />

        <Text>{title ?? translate("error.title")}</Text>
        <p>{description ?? translate("error.description")}</p>

        <Button variant="primary" onClick={() => navigate(buttonTarget)}>
          {buttonLabel ?? translate("error.button")}
        </Button>
      </div>
    </ConstraintContainer>
  );
}
