import { useState } from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";
import { useTranslations } from "@/i18n";
import Checkbox from "@/components/Checkbox";
import ConstraintContainer from "@/components/ConstraintContainer";
import Form from "@/components/Form";
import Snackbar from "@/components/Snackbar";
import Surface from "@/components/Surface";

import type { User } from "@/types/user";

import CharacterSelect from "./CharacterSelect";

export default function Preferences() {
  const { currentLocale, translate, setCurrentLocale } = useTranslations();
  const [showEditAccountSuccess, setShowEditAccountSuccess] = useState(false);
  const [showEditAccountError, setShowEditAccountError] = useState(false);
  const [editAccountErrorMessage, setEditAccountErrorMessage] = useState("");

  const { user, setCurrentUser } = useCurrentUser();

  return (
    <ConstraintContainer>
      <Surface disableSkew>
        <Form
          method="PUT"
          action="/update-user"
          onSubmit={() => {
            setShowEditAccountSuccess(false);
            setShowEditAccountError(false);
          }}
          onSuccess={(response: { user: User }) => {
            setShowEditAccountSuccess(true);
            setCurrentUser(response.user);
          }}
          onError={(error) => {
            setEditAccountErrorMessage(error.message ?? "An error occurred");
            setShowEditAccountError(true);
          }}
        >
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

          <div className="row">
            <label htmlFor="mario-character">
              {translate("account.marioCharacter.label")}
            </label>

            <CharacterSelect defaultValue={user.marioCharacter} />

            <span className="helper">
              {translate("account.marioCharacter.helper")}
            </span>
          </div>
        </Form>
      </Surface>
      <Snackbar
        isOpen={showEditAccountSuccess}
        onClose={() => setShowEditAccountSuccess(false)}
      >
        {translate("account.save.success")}
      </Snackbar>

      <Snackbar
        isOpen={showEditAccountError}
        onClose={() => setShowEditAccountError(false)}
        type="error"
      >
        {editAccountErrorMessage}
      </Snackbar>
    </ConstraintContainer>
  );
}
