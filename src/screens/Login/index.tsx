import Text from "@/components/Text";
import GoogleLoginButton from "@/auth/GoogleLoginButton";
import DiscordLoginButton from "@/auth/DiscordLoginButton";
import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import "./Login.css";
import Button from "@/components/Button";

function Login() {
  const { logout, user, isAnonymous } = useCurrentUser();
  const { translate } = useTranslations();

  return (
    <div className="login-screen">
      <h2>
        {isAnonymous
          ? translate("login.screen.title")
          : translate("logout.label")}
      </h2>

      <div className="login-content">
        {isAnonymous ? (
          <>
            <Text component="p">{translate("login.screen.description")}</Text>
            <div className="login-buttons">
              <GoogleLoginButton />
              <DiscordLoginButton />
            </div>
          </>
        ) : (
          <>
            <Text component="p">
              {translate("upload.step3.login.info")(user.username, user.email)}
            </Text>

            <div>
              <Button variant="secondary" onClick={logout}>
                {translate("logout.label")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
