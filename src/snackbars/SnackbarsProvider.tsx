import {
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";

import Snackbar from "@/components/Snackbar";

type SnackbarsContextType = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

const SnackbarsContext = createContext<SnackbarsContextType>({
  showSuccess: () => {},
  showError: () => {},
} as SnackbarsContextType);

export function SnackbarsProvider({ children }: { children: ReactNode }) {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setShowErrorSnackbar(false);
    setShowSuccessSnackbar(true);
  }, []);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setShowSuccessSnackbar(false);
    setShowErrorSnackbar(true);
  }, []);

  return (
    <SnackbarsContext value={{ showSuccess, showError }}>
      {children}
      <Snackbar
        type="success"
        isOpen={showSuccessSnackbar}
        onClose={() => setShowSuccessSnackbar(false)}
        timeout={5000}
      >
        {successMessage}
      </Snackbar>

      <Snackbar
        type="error"
        isOpen={showErrorSnackbar}
        onClose={() => setShowErrorSnackbar(false)}
        timeout={5000}
      >
        {errorMessage}
      </Snackbar>
    </SnackbarsContext>
  );
}

export function useSnackbars() {
  const context = useContext(SnackbarsContext);

  if (!context) {
    throw new Error("useSnackbars must be used within a SnackbarsProvider");
  }

  return context;
}
