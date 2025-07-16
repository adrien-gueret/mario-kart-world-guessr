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
  onSuccess?: (response: Response) => void;
  onError?: (error: Response | Error) => void;
};

async function onSubmit(
  event: React.FormEvent<HTMLFormElement>,
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

  console.log(formData);

  try {
    const response = await fetchApi(
      action,
      form.method as FetchMethod,
      formData
    );

    if (!response.ok) {
      onError(response);
    }

    onSuccess(response);
  } catch (error: any) {
    console.error("Error submitting form:", error);
    onError(error);
  }
}

export default function Form({
  action,
  children,
  submitLabel,
  method = "POST",
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
      setIsProcessing(true);
      await onSubmit(event, onSuccess, onError);
      setIsProcessing(false);
    },
    [isProcessing, onSuccess, onError]
  );

  return (
    <form
      className="form"
      method={method}
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
