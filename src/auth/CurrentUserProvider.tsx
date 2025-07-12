import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { googleLogout } from "@react-oauth/google";

import { useTranslations } from "@/i18n";

import { storeKey } from "@/services/store";

import type { User } from "@/types/user";
import fetchApi from "@/services/api";
import Loader from "@/components/Loader";

type CurrentUserContextType = {
  user: User;
  isAnonymous: boolean;
  setCurrentUser: (user: User) => void;
  logout: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextType>({
  user: {
    id: 0,
    username: "",
    email: "",
    accessToken: "",
    refreshToken: "",
    expiredAt: "",
  },
  isAnonymous: true,
  setCurrentUser: () => {},
  logout: () => {},
} as CurrentUserContextType);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { currentLocale } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const hasBeenMounted = useRef(false);

  const logout = useCallback(() => {
    setCurrentUser(null);
    storeKey("currentUser", null);
    googleLogout();
    window.location.reload();
  }, []);

  const storeConnectedUser = useCallback(
    (user: User | null) => {
      storeKey("currentUser", user);
      setCurrentUser(user);
    },
    [setCurrentUser]
  );

  useEffect(() => {
    if (hasBeenMounted.current) {
      return;
    }

    hasBeenMounted.current = true;

    setIsLoading(true);

    fetchApi("/me", "GET", void 0, currentLocale)
      .then((response) => response.json())
      .then((user) => {
        setCurrentUser(user);
        storeConnectedUser(user);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser, logout]);

  return isLoading || !currentUser ? (
    <Loader />
  ) : (
    <CurrentUserContext
      value={{
        user: currentUser,
        isAnonymous: !currentUser.email,
        setCurrentUser: storeConnectedUser,
        logout,
      }}
    >
      {children}
    </CurrentUserContext>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }

  return context;
}
