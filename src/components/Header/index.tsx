import { useCurrentUser } from "@/auth/CurrentUserProvider";
import Button from "@/components/Button";
import ConnectedUserHeaderItem from "@/components/ConnectedUserHeaderItem";
import { useTranslations } from "@/i18n";

type Props = {
  showHomeButton?: boolean;
};

export default function Header({ showHomeButton }: Props) {
  const { translate } = useTranslations();
  const { isAnonymous } = useCurrentUser();
  return (
    <header className="app-header">
      {isAnonymous ? (
        <Button
          className="app-login-button"
          onClick={() => setCurrentScreenName("Login")}
          variant="primary"
        >
          {translate("login.screen.title")}
        </Button>
      ) : (
        <ConnectedUserHeaderItem />
      )}

      {showHomeButton && (
        <Button
          onClick={() => setCurrentScreenName("Home")}
          variant="secondary"
        >
          {translate("home.button")}
        </Button>
      )}
    </header>
  );
}
