import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import Credits from "@/components/Credits";

import { useTranslations } from "@/i18n";
import LanguageSelector from "@/i18n/LanguageSelector";

import { useScreen } from "@/screens/ScreensProvider";
import NewVersionModal from "@/versions/NewVersionModal";

function App() {
  const { currentScreenName, setCurrentScreenName, CurrentScreen } =
    useScreen();

  const { isAnonymous, user, logout } = useCurrentUser();

  const { translate, currentLocale, setCurrentLocale } = useTranslations();

  return (
    <div className={`app-${currentScreenName}`}>
      <header className="app-header">
        <div className="user-connection">
          {isAnonymous ? (
            <a href="#/login">{translate("login.screen.title")}</a>
          ) : (
            <>
              <b>{user.username}</b>
              &bull;
              <a href="#" onClick={logout}>
                {translate("logout.label")}
              </a>
            </>
          )}
        </div>
        <LanguageSelector value={currentLocale} onChange={setCurrentLocale} />
        <Button
          className="app-home-button"
          onClick={() => setCurrentScreenName("Title")}
          variant="secondary"
        >
          {translate("home.button")}
        </Button>
      </header>
      <div className="app-container">
        <Logo />
        <CurrentScreen />
        <Credits />
      </div>
      <NewVersionModal />
    </div>
  );
}

export default App;
