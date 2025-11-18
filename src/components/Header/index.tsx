import { useCurrentUser } from "@/auth/CurrentUserProvider";
import Button from "@/components/Button";
import ConnectedUserHeaderItem from "@/components/ConnectedUserHeaderItem";
import { useTranslations } from "@/i18n";
import useNavigate from "@/services/useNavigate";

type Props = {
  showHomeButton?: boolean;
};

export default function Header({ showHomeButton }: Props) {
  const { translate } = useTranslations();
  const { isAnonymous } = useCurrentUser();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      {isAnonymous ? (
        <Button
          className="app-login-button"
          onClick={() => navigate("/login")}
          variant="primary"
        >
          {translate("login.screen.title")}
        </Button>
      ) : (
        <ConnectedUserHeaderItem />
      )}

      {showHomeButton && (
        <Button onClick={() => navigate("/home")} variant="secondary">
          {translate("home.button")}
        </Button>
      )}
    </header>
  );
}
