import { type ReactNode } from "react";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import Button from "../Button";
import FormBase from "../FormBase";

import "./Form.css";

type FetchParameters = Parameters<typeof fetchApi>;

type ApiEndPoint = FetchParameters[0];
type FetchMethod = FetchParameters[1];

type Props = {
  action: ApiEndPoint;
  submitLabel?: string;
  method?: FetchMethod;
  children: ReactNode;
  successMessage: string;
  onCancel?: () => void;
  onSuccess?: (response: any) => void;
  onError?: (error: { message: string }) => void;
};

export default function Form({
  action,
  children,
  submitLabel,
  successMessage,
  method = "POST",
  onCancel,
  onSuccess = () => {},
  onError = (error) => {
    console.error("Form submission error:", error);
  },
}: Props) {
  const { translate } = useTranslations();

  return (
    <FormBase
      method={method}
      action={action}
      successMessage={successMessage}
      onSuccess={onSuccess}
      onError={onError}
    >
      <div className="form">
        {children}

        <div className={`form-actions ${onCancel ? "" : "center"}`}>
          {onCancel && (
            <Button variant="secondary" type="button" onClick={onCancel}>
              {translate("form.cancel")}
            </Button>
          )}
          <Button variant="primary" type="submit">
            {submitLabel ?? translate("form.submit")}
          </Button>
        </div>
      </div>
    </FormBase>
  );
}
