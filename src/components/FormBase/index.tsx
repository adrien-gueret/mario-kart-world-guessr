import { useCallback, type ReactNode, useState } from "react";

import fetchApi from "@/services/api";

import { useSnackbars } from "@/snackbars";

type FetchParameters = Parameters<typeof fetchApi>;

type ApiEndPoint = FetchParameters[0];
type FetchMethod = FetchParameters[1];

type Props = {
  action: ApiEndPoint;
  method?: FetchMethod;
  children?: ReactNode;
  id?: string;
  successMessage: string;
  onProcessingChange?: (isProcessing: boolean) => void;
  onSuccess?: (response: any) => void;
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

export default function FormBase({
  action,
  children = null,
  id,
  successMessage,
  method = "POST",
  onProcessingChange = () => {},
  onSuccess = () => {},
  onError = (error) => {
    console.error("Form submission error:", error);
  },
}: Props) {
  const { showError, showSuccess } = useSnackbars();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isProcessing) {
        return;
      }

      setIsProcessing(true);
      onProcessingChange(true);
      const { success, data } = await submitFormAndCallAPI(event, method);
      setIsProcessing(false);
      onProcessingChange(false);

      if (success) {
        onSuccess(data);
        showSuccess(successMessage);
      } else {
        onError(data);
        showError(data.message || "An error occurred during form submission.");
      }
    },
    [isProcessing, showSuccess, showError, successMessage, onSuccess, onError]
  );

  return (
    <form
      id={id}
      method={method === "GET" ? "GET" : "POST"}
      action={action}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}
