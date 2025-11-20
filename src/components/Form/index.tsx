import { useCallback, type ReactNode, useState } from "react";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import Button from "../Button";
import Snackbar from "../Snackbar";

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
  withoutStyle?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  onSuccess: (response: any) => void;
  onError?: (error: { message: string }) => void;
};

async function submitFormAndCallAPI(
  event: React.FormEvent<HTMLFormElement>,
  method: FetchMethod
): Promise<{ success: boolean; data: any }> {
  const form = event.currentTarget;
  const formData = new FormData(form);
  const action = form.getAttribute("action") as ApiEndPoint | null;

  if (!action) {
    console.error("Form action is not defined.");
    return { success: false, data: null };
  }

  try {
    const response = await fetchApi(action, method, formData);

    const responseJson = await response.json();

    if (response.ok) {
      return { success: true, data: responseJson };
    }
    return { success: false, data: responseJson };
  } catch (error: any) {
    return { success: false, data: error };
  }
}

export default function Form({
  action,
  children,
  submitLabel,
  successMessage,
  method = "POST",
  onSubmit = () => {},
  onCancel,
  onSuccess,
  onError = (error) => {
    console.error("Form submission error:", error);
  },
  withoutStyle,
}: Props) {
  const { translate } = useTranslations();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFormSuccess, setShowFormSuccess] = useState(false);
  const [showFormError, setShowFormError] = useState(false);
  const [editFormErrorMessage, setEditFormErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isProcessing) {
        return;
      }

      setShowFormSuccess(false);
      setShowFormError(false);

      onSubmit();
      setIsProcessing(true);
      const { success, data } = await submitFormAndCallAPI(event, method);
      setIsProcessing(false);

      if (success) {
        setShowFormSuccess(true);
        onSuccess(data);
      } else {
        setShowFormError(true);
        setEditFormErrorMessage(data.message ?? "An error occurred");
        onError(data);
      }
    },
    [isProcessing, onSuccess, onError]
  );

  return (
    <>
      <form
        className={withoutStyle ? "" : "form-container"}
        method={method === "GET" ? "GET" : "POST"}
        action={action}
        onSubmit={handleSubmit}
      >
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
      </form>

      <Snackbar
        isOpen={showFormSuccess}
        onClose={() => setShowFormSuccess(false)}
      >
        {successMessage}
      </Snackbar>

      <Snackbar
        isOpen={showFormError}
        onClose={() => setShowFormError(false)}
        type="error"
      >
        {editFormErrorMessage}
      </Snackbar>
    </>
  );
}
