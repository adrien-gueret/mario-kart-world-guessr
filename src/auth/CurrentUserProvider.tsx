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
import { useScreen, type ScreenName } from "@/screens";

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
    marioCharacter: null,
    locale: null,
  },
  isAnonymous: true,
  setCurrentUser: () => {},
  logout: () => {},
} as CurrentUserContextType);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { currentLocale, setCurrentLocale } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { currentScreenName, setCurrentScreenName } = useScreen();
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

    function redirectTo(target: Extract<ScreenName, "Account" | "Login">) {
      window.history.replaceState({}, document.title, window.location.pathname);
      setCurrentScreenName(target, {
        onSuccess: () => {
          setIsLoading(false);
        },
      });
    }

    function fetchMe(
      redirectScreeName?: Extract<ScreenName, "Account" | "Login">
    ) {
      setIsLoading(true);

      fetchApi("/me", "GET")
        .then((response) => response.json())
        .then((user) => {
          setCurrentUser(user);
          storeConnectedUser(user);
          setCurrentLocale(user.locale ?? currentLocale);
        })
        .finally(() => {
          if (redirectScreeName) {
            redirectTo(redirectScreeName);
          } else {
            setIsLoading(false);
          }
        });
    }

    function fetchDiscord(discordCode: string) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("token", discordCode);

      fetchApi("/auth-discord", "POST", formData)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to authenticate with Discord");
          }
          return response.json();
        })
        .then((user) => {
          delete user.isNewUser;
          setCurrentUser(user);
          storeConnectedUser(user);
        })
        .catch(fetchMe)
        .finally(() => {
          redirectTo("Account");
        });
    }

    const searchParams = new URLSearchParams(window.location.search);
    const authCode = searchParams.get("code");
    const state = searchParams.get("state");

    if (state === "from-discord") {
      if (authCode) {
        fetchDiscord(authCode);
      } else {
        fetchMe("Login");
      }
    } else {
      fetchMe();
    }
  }, [currentUser, currentLocale]);

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
