import { useEffect } from "react";

import { useTranslations } from "@/i18n";

import { useCurrentUser } from "@/auth/CurrentUserProvider";

import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Form from "@/components/Form";
import ConstraintContainer from "@/components/ConstraintContainer";
import Surface from "@/components/Surface";

import { useScreen } from "@/screens/ScreensProvider";

export default function Account() {
  const { currentLocale, translate, setCurrentLocale } = useTranslations();
  const { setCurrentScreenName } = useScreen();
  const { user, isAnonymous } = useCurrentUser();

  useEffect(() => {
    if (isAnonymous) {
      setCurrentScreenName("Login");
    }
  }, [isAnonymous,setCurrentScreenName]);

  if (isAnonymous) {
    return null;
  }

  return (
    <ConstraintContainer>
      <h2>{translate("account.title")}</h2>

      <Surface disableSkew>
        <Form method="PUT" action="/update-user">
          <div className="row">
            <label htmlFor="form-username">
              {translate("account.username.label")}
            </label>

            <input
              type="text"
              name="username"
              id="form-username"
              defaultValue={user.username}
              required
            />

            <span className="helper">
              {translate("account.username.helper")}
            </span>
          </div>

          <div className="row">
            <label htmlFor="locale-fr">
              {translate("account.locale.label")}
            </label>
            <Checkbox
              id="locale-fr"
              name="locale"
              label="Français"
              value="fr"
              checked={currentLocale === "fr"}
              onChange={() => setCurrentLocale("fr")}
              isRadio
            />
            <Checkbox
              name="locale"
              label="English"
              value="en"
              checked={currentLocale === "en"}
              onChange={() => setCurrentLocale("en")}
              isRadio
            />
            <span className="helper">{translate("account.locale.helper")}</span>
          </div>
        </Form>
      </Surface>

      <div className="back-button">
        <Button onClick={() => setCurrentScreenName("Title")}>
          {translate("home.button")}
        </Button>
      </div>
    </ConstraintContainer>
  );
}
