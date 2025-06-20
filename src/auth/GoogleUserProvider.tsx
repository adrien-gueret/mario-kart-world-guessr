import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import { googleLogout } from "@react-oauth/google";

type User = {
  givenName: string;
  fullName: string;
  email: string;
  expiredAt: number;
};

type GoogleUserContextType = {
  user: User | null;
  setConnectedUser: (user: User) => void;
  logout: () => void;
};

const GoogleUserContext = createContext<GoogleUserContextType>({
  user: null,
  setConnectedUser: () => {},
  logout: () => {},
} as GoogleUserContextType);

export function GoogleUserProvider({ children }: { children: ReactNode }) {
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    setConnectedUser(null);
    googleLogout();
  }, []);

  return (
    <GoogleUserContext
      value={{
        user: connectedUser,
        setConnectedUser,
        logout,
      }}
    >
      {children}
    </GoogleUserContext>
  );
}

export function useGoogleUser() {
  const context = useContext(GoogleUserContext);

  if (!context) {
    throw new Error("useGoogleUser must be used within a GoogleUserProvider");
  }

  return context;
}
