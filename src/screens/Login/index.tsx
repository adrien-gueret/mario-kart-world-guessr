import Text from "@/components/Text";
import GoogleLoginButton from "@/auth/GoogleLoginButton";
import DiscordLoginButton from "@/auth/DiscordLoginButton";
import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import "./Login.css";

function Login() {
  const { logout, user, isAnonymous } = useCurrentUser();
  const { translate } = useTranslations();

  return (
    <div className="login-screen">
      <h2>Se connecter</h2>

      <Text component="p">Blablabla</Text>

      {false ? (
        <>
          <p>{translate("upload.step3.login.info")(user.email)}</p>
        </>
      ) : (
        <>
          <GoogleLoginButton />
          <DiscordLoginButton />
        </>
      )}
    </div>
  );
}

export default Login;
