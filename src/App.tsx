import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Button from "@/components/Button";
import ConnectedUserHeaderItem from "@/components/ConnectedUserHeaderItem";
import Credits from "@/components/Credits";
import Logo from "@/components/Logo";

import { useTranslations } from "@/i18n";

import { useScreen } from "@/screens/ScreensProvider";
import NewVersionModal from "@/versions/NewVersionModal";
import currentVersion from "@/versions/currentVersion";

function App() {
  const { currentScreenName, setCurrentScreenName, CurrentScreen } =
    useScreen();

  const { isAnonymous } = useCurrentUser();

  const { translate } = useTranslations();

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
          <ConnectedUserHeaderItem />
        )}

        <Button
          className="app-home-button"
          onClick={() => setCurrentScreenName("Home")}
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
      <footer style={{ marginTop: "48px" }}>
        <a
          className="basic-link"
          href={
            currentScreenName === "ReleaseNotes" ? undefined : "#/releasenotes"
          }
        >
          <b>{currentVersion.version}</b>
        </a>
        <br />

        <aside className="aside-links">
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

        <aside className="aside-links">
          <a
            className="basic-link"
            href="https://buymeacoffee.com/mariouniversalis"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>☕ {translate("buy-me-coffee")} ↗</b>
          </a>
        </aside>
      </footer>
    </div>
  );
}

export default App;
