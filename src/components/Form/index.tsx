import { useCallback, type ReactNode, useState } from "react";

import { useTranslations } from "@/i18n";

import fetchApi from "@/services/api";

import Button from "../Button";

import "./Form.css";

type FetchParameters = Parameters<typeof fetchApi>;

type ApiEndPoint = FetchParameters[0];
type FetchMethod = FetchParameters[1];

type Props = {
  action: ApiEndPoint;
  submitLabel?: string;
  method?: FetchMethod;
  children: ReactNode;
  onSubmit?: () => void;
  onSuccess?: (response: any) => void;
  onError?: (error: { message: string }) => void;
};

async function submitFormAndCallAPI(
  event: React.FormEvent<HTMLFormElement>,
  method: FetchMethod,
  onSuccess: Required<Props>["onSuccess"],
  onError: Required<Props>["onError"]
) {
  const form = event.currentTarget;
  const formData = new FormData(form);
  const action = form.getAttribute("action") as ApiEndPoint | null;

  if (!action) {
    console.error("Form action is not defined.");
    return;
  }

  try {
    const response = await fetchApi(action, method, formData);

    const responseJson = await response.json();

    if (response.ok) {
      onSuccess(responseJson);
    } else {
      onError(responseJson);
    }
  } catch (error: any) {
    onError(error);
  }
}

export default function Form({
  action,
  children,
  submitLabel,
  method = "POST",
  onSubmit = () => {},
  onSuccess = () => {},
  onError = (error) => {
    console.error("Form submission error:", error);
  },
}: Props) {
  const { translate } = useTranslations();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isProcessing) {
        return;
      }

      onSubmit();
      setIsProcessing(true);
      await submitFormAndCallAPI(event, method, onSuccess, onError);
      setIsProcessing(false);
    },
    [isProcessing, onSuccess, onError]
  );

  return (
    <form
      className="form"
      method={method === "GET" ? "GET" : "POST"}
      action={action}
      onSubmit={handleSubmit}
    >
      {children}

      <Button variant="secondary" type="submit">
        {submitLabel ?? translate("form.submit")}
      </Button>
    </form>
  );
}
