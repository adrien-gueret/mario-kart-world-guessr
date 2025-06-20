import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

import { useGoogleUser } from "./GoogleUserProvider";

export default function GoogleLoginButton() {
  const { setConnectedUser } = useGoogleUser();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential as string) as {
          name: string;
          given_name: string;
          email: string;
          exp: number;
        };

        setConnectedUser({
          givenName: decoded.given_name,
          fullName: decoded.name,
          email: decoded.email,
          expiredAt: decoded.exp * 1000,
        });
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
