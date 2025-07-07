import { GoogleLogin } from "@react-oauth/google";

import fetchApi from "@/services/api";

import { useCurrentUser } from "./CurrentUserProvider";

export default function GoogleLoginButton() {
  const { setConnectedUser } = useCurrentUser();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const formData = new FormData();
        formData.append("token", credentialResponse.credential as string);

        const response = await fetchApi("/auth-google.php", "POST", formData);
        const user = await response.json();

        delete user.isNewUser;

        setConnectedUser(user);
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
