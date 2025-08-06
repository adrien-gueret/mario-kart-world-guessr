import { useEffect } from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import Credits from "@/components/Credits";

import { useTranslations } from "@/i18n";

import { useScreen } from "@/screens/ScreensProvider";
import NewVersionModal from "@/versions/NewVersionModal";
import currentVersion from "@/versions/currentVersion";

declare global {
  interface WindowEventMap {
    achievementUnlocked: CustomEvent<{ achievementId: string }>;
  }
}

function App() {
  const { currentScreenName, setCurrentScreenName, CurrentScreen } =
    useScreen();

  const { isAnonymous, user, logout } = useCurrentUser();

  const { translate } = useTranslations();

  useEffect(() => {
    const onAchievementUnlocked = (
      event: CustomEvent<{ achievementId: string }>
    ) => {
      console.log("Achievement unlocked:", event.detail);
    };

    window.addEventListener("achievementUnlocked", onAchievementUnlocked);

    return () => {
      window.removeEventListener("achievementUnlocked", onAchievementUnlocked);
    };
  }, []);

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
            {user.marioCharacter && (
              <img
                style={{ width: "32px", verticalAlign: "text-bottom" }}
                src={`./ui/pins/icon-${user.marioCharacter}.png`}
                alt=""
              />
            )}
            <a href="#/account">
              <b>{user.username}</b>
            </a>
            &bull;
            <a href="#" onClick={logout}>
              {translate("logout.label")}
            </a>
          </div>
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
      </footer>
    </div>
  );
}

export default App;
