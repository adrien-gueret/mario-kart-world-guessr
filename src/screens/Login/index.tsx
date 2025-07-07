import { useState } from "react";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Text from "@/components/Text";
import GoogleLoginButton from "@/auth/GoogleLoginButton";
import { useCurrentUser } from "@/auth/CurrentUserProvider";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import "./Login.css";

function Login() {
  const { logout, user } = useCurrentUser();
  const { translate } = useTranslations();

  return (
    <div className="login-screen">
      <h2>Se connecter</h2>

      <Text component="p">Blablabla</Text>

      {user ? (
        <>
          <p>{translate("upload.step3.login.info")(user.email)}</p>
        </>
      ) : (
        <GoogleLoginButton />
      )}
    </div>
  );
}

export default Login;
