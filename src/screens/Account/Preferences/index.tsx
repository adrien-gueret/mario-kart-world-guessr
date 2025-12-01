import { useState } from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";
import { useTranslations } from "@/i18n";
import Checkbox from "@/components/Checkbox";
import ConstraintContainer from "@/components/ConstraintContainer";
import Form from "@/components/Form";
import Surface from "@/components/Surface";

import type { User } from "@/types/user";

import CharacterSelect from "./CharacterSelect";

export default function Preferences() {
  const { currentLocale, translate, setCurrentLocale } = useTranslations();

  const { user, setCurrentUser } = useCurrentUser();

  const [currentDistanceUnit, setCurrentDistanceUnit] = useState<
    "km" | "miles"
  >(user.distanceUnit ?? "km");

  return (
    <ConstraintContainer>
      <Surface disableSkew>
        <Form
          method="PUT"
          action="/update-user"
          successMessage={translate("account.save.success")}
          onSuccess={(response: { user: User }) => {
            setCurrentUser(response.user);
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
            <label htmlFor="locale-fr">
              {translate("account.distanceUnit.label")}
            </label>
            <Checkbox
              id="distance-km"
              name="distanceUnit"
              label={translate("account.distanceUnit.km")}
              value="km"
              checked={currentDistanceUnit === "km"}
              onChange={() => setCurrentDistanceUnit("km")}
              isRadio
            />
            <Checkbox
              id="distance-miles"
              name="distanceUnit"
              label={translate("account.distanceUnit.miles")}
              value="miles"
              checked={currentDistanceUnit === "miles"}
              onChange={() => setCurrentDistanceUnit("miles")}
              isRadio
            />
            <span className="helper">
              {translate("account.distanceUnit.helper")}
            </span>
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
    </ConstraintContainer>
  );
}
