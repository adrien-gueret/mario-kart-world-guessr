import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import Credits from "@/components/Credits";

import { useTranslations } from "@/i18n";
import LanguageSelector from "@/i18n/LanguageSelector";

import { useScreen } from "@/screens/ScreensProvider";
import NewVersionModal from "@/versions/NewVersionModal";
import currentVersion from "@/versions/currentVersion";

function App() {
  const { currentScreenName, setCurrentScreenName, CurrentScreen } =
    useScreen();

  const { isAnonymous, user, logout } = useCurrentUser();

  const { translate, currentLocale, setCurrentLocale } = useTranslations();

  return (
    <div className={`app-${currentScreenName}`}>
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
          <div className="user-connection">
            <b>{user.username}</b>
            &bull;
            <a href="#" onClick={logout}>
              {translate("logout.label")}
            </a>
          </div>
        )}

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
      <p>
        <a
          className="basic-link"
          href={
            currentScreenName === "ReleaseNotes" ? undefined : "#/releasenotes"
          }
        >
          <b>{currentVersion}</b>
        </a>
        <br />

        <aside className="legal-links">
          <a
            className="basic-link"
            href={
              currentScreenName === "PrivacyPolicies"
                ? undefined
                : "#/privacypolicies"
            }
          >
            <b>{translate("privacy-policies.title")}</b>
          </a>
          <a
            className="basic-link"
            href={
              currentScreenName === "TermsServices"
                ? undefined
                : "#/termsservices"
            }
          >
            <b>{translate("terms-services.title")}</b>
          </a>
        </aside>
      </p>
    </div>
  );
}

export default App;
