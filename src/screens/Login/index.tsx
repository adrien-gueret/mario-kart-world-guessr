import { useEffect, useRef } from "react";

import Text from "@/components/Text";
import GoogleLoginButton from "@/auth/GoogleLoginButton";
import DiscordLoginButton from "@/auth/DiscordLoginButton";
import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import { useScreen } from "@/screens/ScreensProvider";

import "./Login.css";

function Login() {
  const { isAnonymous } = useCurrentUser();
  const { translate } = useTranslations();
  const { setCurrentScreenName, state } = useScreen();

  const targetScreenNameRef = useRef(state.targetScreenName || "Account");

  useEffect(() => {
    if (!isAnonymous) {
      setCurrentScreenName(targetScreenNameRef.current ?? "Account");
    }
  }, [isAnonymous]);

  if (!isAnonymous) {
    return null;
  }

  return (
    <div className="login-screen">
      <h2>{translate("login.screen.title")}</h2>

      <div className="login-content">
        <Text component="p">{translate("login.screen.description")}</Text>
        <div className="login-buttons">
          <GoogleLoginButton />
          <DiscordLoginButton targetScreenName={targetScreenNameRef.current} />
        </div>
      </div>
    </div>
  );
}

export default Login;
