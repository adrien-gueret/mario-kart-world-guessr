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
import AccountNotifications from "./Account/Notifications/screen";
import AccountPhotos from "./Account/Photos/screen";
import AccountAlbums from "./Account/Albums/screen";
import AccountPreferences from "./Account/Preferences/screen";
import { SurvivalGame, GoalGame, DailyGame, ChronoGame } from "./Game";
import Home from "./Home";
import Leaderboards from "./Leaderboards";
import Login from "./Login";
import Photos from "./Photos";
import Play from "./Play";
import PrivacyPolicies from "./PrivacyPolicies";
import Upload from "./Upload";
import UploadHelp from "./UploadHelp";
import ReleaseNotes from "./ReleaseNotes";
import TermsServices from "./TermsServices";

export type ScreenName =
  | "Account"
  | "Account/Notifications"
  | "Account/Photos"
  | "Account/Albums"
  | "Account/Preferences"
  | "DailyGame"
  | "GoalGame"
  | "ChronoGame"
  | "Home"
  | "Leaderboards"
  | "Login"
  | "Photos"
  | "Play"
  | "PrivacyPolicies"
  | "ReleaseNotes"
  | "SurvivalGame"
  | "TermsServices"
  | "Upload"
  | "UploadHelp";
type ScreenHashtag = `#/${Lowercase<ScreenName>}`;

const screenHashtagsToScreenNames: Record<ScreenHashtag, ScreenName> = {
  "#/account": "Account",
  "#/account/notifications": "Account/Notifications",
  "#/account/photos": "Account/Photos",
  "#/account/albums": "Account/Albums",
  "#/account/preferences": "Account/Preferences",
  "#/dailygame": "DailyGame",
  "#/goalgame": "GoalGame",
  "#/chronogame": "ChronoGame",
  "#/home": "Home",
  "#/leaderboards": "Leaderboards",
  "#/login": "Login",
  "#/photos": "Photos",
  "#/play": "Play",
  "#/privacypolicies": "PrivacyPolicies",
  "#/releasenotes": "ReleaseNotes",
  "#/survivalgame": "SurvivalGame",
  "#/termsservices": "TermsServices",
  "#/upload": "Upload",
  "#/uploadhelp": "UploadHelp",
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
    Account,
    "Account/Notifications": AccountNotifications,
    "Account/Photos": AccountPhotos,
    "Account/Albums": AccountAlbums,
    "Account/Preferences": AccountPreferences,
    DailyGame,
    GoalGame,
    ChronoGame,
    Home,
    Leaderboards,
    Login,
    Photos,
    Play,
    PrivacyPolicies,
    ReleaseNotes,
    SurvivalGame,
    TermsServices,
    Upload,
    UploadHelp,
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
