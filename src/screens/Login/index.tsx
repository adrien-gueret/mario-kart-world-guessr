import { useEffect, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Text from "@/components/Text";
import GoogleLoginButton from "@/auth/GoogleLoginButton";
import DiscordLoginButton from "@/auth/DiscordLoginButton";
import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import "./Login.css";

function Login() {
  const { isAnonymous } = useCurrentUser();
  const { translate } = useTranslations();
  const { state } = useLocation();
  const navigate = useNavigate();

  const targetUrlRef = useRef(state.targetUrl || "/account");

  useEffect(() => {
    if (!isAnonymous) {
      navigate(targetUrlRef.current ?? "/account");
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
          <DiscordLoginButton targetUrl={targetUrlRef.current} />
        </div>
      </div>
    </div>
  );
}

export default Login;
