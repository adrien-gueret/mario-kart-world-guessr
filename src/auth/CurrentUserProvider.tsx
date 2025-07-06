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

import { getKey, storeKey } from "@/services/store";

import type { User } from "@/types/user";
import fetchApi from "@/services/api";
import Loader from "@/components/Loader";

type CurrentUserContextType = {
  user: User | null;
  setConnectedUser: (user: User) => void;
  logout: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextType>({
  user: null,
  setConnectedUser: () => {},
  logout: () => {},
} as CurrentUserContextType);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [connectedUser, setConnectedUser] = useState<User | null>(() =>
    getKey("currentUser")
  );
  const hasBeenMounted = useRef(false);

  const logout = useCallback(() => {
    setConnectedUser(null);
    storeKey("currentUser", null);
    googleLogout();
  }, []);

  const storeConnectedUser = useCallback(
    (user: User | null) => {
      storeKey("currentUser", user);
      setConnectedUser(user);
    },
    [setConnectedUser]
  );

  useEffect(() => {
    if (hasBeenMounted.current) {
      return;
    }

    hasBeenMounted.current = true;

    if (connectedUser) {
      setIsLoading(true);
      fetchApi("/me", "GET")
        .then((response) => response.json())
        .then((response) => {
          if (!response.user) {
            logout();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [connectedUser, logout]);

  return (
    <CurrentUserContext
      value={{
        user: connectedUser,
        setConnectedUser: storeConnectedUser,
        logout,
      }}
    >
      {isLoading ? <Loader /> : children}
    </CurrentUserContext>
  );
}

export function useCurrentser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error("useCurrentser must be used within a CurrentUserProvider");
  }

  return context;
}
