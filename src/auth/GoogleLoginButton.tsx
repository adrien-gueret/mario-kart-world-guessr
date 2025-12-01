import { GoogleLogin } from "@react-oauth/google";

import { useTranslations } from "@/i18n";
import fetchApi from "@/services/api";

import { useCurrentUser } from "./CurrentUserProvider";

export default function GoogleLoginButton() {
  const { setCurrentUser } = useCurrentUser();
  const { setCurrentLocale } = useTranslations();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const formData = new FormData();
        formData.append("token", credentialResponse.credential as string);

        const response = await fetchApi("/auth-google.php", "POST", formData);
        const user = await response.json();

        delete user.isNewUser;

        setCurrentUser(user);
        setCurrentLocale(user.locale ?? "en");
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      size="large"
      shape="pill"
      logo_alignment="left"
    />
  );
}
