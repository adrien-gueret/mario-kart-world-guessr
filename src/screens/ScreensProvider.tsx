import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type ElementType,
} from "react";

import { flushSync } from "react-dom";

import Account from "./Account";
import { SurvivalGame, GoalGame, DailyGame } from "./Game";
import Home from "./Home";
import Leaderboards from "./Leaderboards";
import Login from "./Login";
import Photos from "./Photos";
import Play from "./Play";
import Upload from "./Upload";
import PrivacyPolicies from "./PrivacyPolicies";
import ReleaseNotes from "./ReleaseNotes";
import TermsServices from "./TermsServices";

export type ScreenName =
  | "Home"
  | "Play"
  | "Leaderboards"
  | "SurvivalGame"
  | "GoalGame"
  | "DailyGame"
  | "Upload"
  | "Photos"
  | "Login"
  | "PrivacyPolicies"
  | "TermsServices"
  | "ReleaseNotes"
  | "Account";
type ScreenHashtag = `#/${Lowercase<ScreenName>}`;

const screenHashtagsToScreenNames: Record<ScreenHashtag, ScreenName> = {
  "#/home": "Home",
  "#/play": "Play",
  "#/leaderboards": "Leaderboards",
  "#/survivalgame": "SurvivalGame",
  "#/goalgame": "GoalGame",
  "#/dailygame": "DailyGame",
  "#/upload": "Upload",
  "#/photos": "Photos",
  "#/login": "Login",
  "#/privacypolicies": "PrivacyPolicies",
  "#/termsservices": "TermsServices",
  "#/releasenotes": "ReleaseNotes",
  "#/account": "Account",
};

type ScreenState = Record<string, any>;

type ScreenContextType = {
  currentScreenName: ScreenName;
  CurrentScreen: ElementType;
  state: ScreenState;
  setCurrentScreenName: (
    screenName: ScreenName,
    options?: {
      onSuccess?: () => void;
      state?: ScreenState;
    }
  ) => void;
};

const ScreenContext = createContext<ScreenContextType>({
  currentScreenName: "Home",
  CurrentScreen: () => null,
  setCurrentScreenName: () => "",
  state: {},
} as ScreenContextType);

const getScreenNameFromHash = (): ScreenName => {
  const newHash = window.location.hash as ScreenHashtag;

  const newScreenName = newHash ? screenHashtagsToScreenNames[newHash] : "Home";

  return newScreenName ?? "Home";
};

const removeHomeTagFromHash = (currentScreenName: ScreenName): boolean => {
  if (currentScreenName !== "Home") {
    return false;
  }

  const noHashURL = window.location.href.replace(/#.*$/, "");
  window.history.replaceState("", document.title, noHashURL);

  return true;
};

export function ScreensProvider({ children }: { children: ReactNode }) {
  const [currentScreenName, setCurrentScreenName] = useState<ScreenName>(
    () => getScreenNameFromHash() ?? "Home"
  );

  const [screenState, setScreenState] = useState<Record<string, any>>({});

  const ScreenNameToScreen: Record<ScreenName, ElementType> = {
    Home,
    Play,
    Leaderboards,
    SurvivalGame,
    GoalGame,
    DailyGame,
    Upload,
    Photos,
    Login,
    PrivacyPolicies,
    TermsServices,
    ReleaseNotes,
    Account,
  };

  const handleHashChange = () => {
    const newScreenName = getScreenNameFromHash();

    document.startViewTransition(() => {
      flushSync(() => {
        setCurrentScreenName(newScreenName);
        removeHomeTagFromHash(newScreenName);

        window.requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      });
    });
  };

  const goToScreen = useCallback(
    (
      screenName: ScreenName,
      {
        onSuccess,
        state = {},
      }: { onSuccess?: () => void; state?: ScreenState } = {}
    ) => {
      if (removeHomeTagFromHash(screenName)) {
        handleHashChange();
      } else {
        window.location.hash = `/${screenName.toLowerCase()}`;
      }

      setScreenState(state);

      if (onSuccess) {
        window.setTimeout(onSuccess, 500);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <ScreenContext
      value={{
        currentScreenName,
        CurrentScreen: ScreenNameToScreen[currentScreenName],
        state: screenState,
        setCurrentScreenName: goToScreen,
      }}
    >
      {children}
    </ScreenContext>
  );
}

export function useScreen() {
  const context = useContext(ScreenContext);

  if (!context) {
    throw new Error("useScreen must be used within a ScreensProvider");
  }

  return context;
}
