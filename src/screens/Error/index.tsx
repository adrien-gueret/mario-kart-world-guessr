import Button from "@/components/Button";
import ConstraintContainer from "@/components/ConstraintContainer";
import Text from "@/components/Text";

import useNavigate from "@/services/useNavigate";
import { useTranslations } from "@/i18n";

export default function ErrorScreen() {
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
        <img src="./ui/toad_oopsy.png" alt="" aria-hidden="true" />

        <Text>{translate("error.title")}</Text>
        <p>{translate("error.description")}</p>

        <Button variant="primary" onClick={() => navigate("/")}>
          {translate("error.button")}
        </Button>
      </div>
    </ConstraintContainer>
  );
}
