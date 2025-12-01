import { useTranslations } from "@/i18n";
import ErrorScreen from ".";

export default function LogoutWarning() {
  const { translate } = useTranslations();

  return (
    <ErrorScreen
      imageUrl="./ui/lakitu_stop.png"
      title={translate("error.logoutWarning.title")}
      description={translate("error.logoutWarning.description")}
      buttonLabel={translate("error.logoutWarning.button")}
      buttonTarget="/login"
    />
  );
}
