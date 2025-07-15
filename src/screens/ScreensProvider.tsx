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

import { SurvivalGame, GoalGame, DailyGame } from "./Game";
import Login from "./Login";
import Photos from "./Photos";
import Title from "./Title";
import Upload from "./Upload";
import PrivacyPolicies from "./PrivacyPolicies";
import ReleaseNotes from "./ReleaseNotes";
import TermsServices from "./TermsServices";

export type ScreenName =
  | "Title"
  | "SurvivalGame"
  | "GoalGame"
  | "DailyGame"
  | "Upload"
  | "Photos"
  | "Login"
  | "PrivacyPolicies"
  | "TermsServices"
  | "ReleaseNotes";
type ScreenHashtag = `#/${Lowercase<ScreenName>}`;

const screenHashtagsToScreenNames: Record<ScreenHashtag, ScreenName> = {
  "#/title": "Title",
  "#/survivalgame": "SurvivalGame",
  "#/goalgame": "GoalGame",
  "#/dailygame": "DailyGame",
  "#/upload": "Upload",
  "#/photos": "Photos",
  "#/login": "Login",
  "#/privacypolicies": "PrivacyPolicies",
  "#/termsservices": "TermsServices",
  "#/releasenotes": "ReleaseNotes",
};

type ScreenContextType = {
  currentScreenName: ScreenName;
  CurrentScreen: ElementType;
  setCurrentScreenName: (screenName: ScreenName) => void;
};

const ScreenContext = createContext<ScreenContextType>({
  currentScreenName: "Title",
  CurrentScreen: () => null,
  setCurrentScreenName: () => "",
} as ScreenContextType);

const getScreenNameFromHash = (): ScreenName => {
  const newHash = window.location.hash as ScreenHashtag;

  const newScreenName = newHash
    ? screenHashtagsToScreenNames[newHash]
    : "Title";

  return newScreenName ?? "Title";
};

const removeTitleTagFromHash = (currentScreenName: ScreenName): boolean => {
  if (currentScreenName !== "Title") {
    return false;
  }

  const noHashURL = window.location.href.replace(/#.*$/, "");
  window.history.replaceState("", document.title, noHashURL);

  return true;
};

export function ScreensProvider({ children }: { children: ReactNode }) {
  const [currentScreenName, setCurrentScreenName] = useState<ScreenName>(
    () => getScreenNameFromHash() ?? "Title"
  );

  const ScreenNameToScreen: Record<ScreenName, ElementType> = {
    Title,
    SurvivalGame,
    GoalGame,
    DailyGame,
    Upload,
    Photos,
    Login,
    PrivacyPolicies,
    TermsServices,
    ReleaseNotes,
  };

  const handleHashChange = () => {
    const newScreenName = getScreenNameFromHash();

    document.startViewTransition(() => {
      flushSync(() => {
        setCurrentScreenName(newScreenName);
        removeTitleTagFromHash(newScreenName);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    });
  };

  const goToScreen = useCallback((screenName: ScreenName) => {
    if (removeTitleTagFromHash(screenName)) {
      handleHashChange();
    } else {
      window.location.hash = `/${screenName.toLowerCase()}`;
    }
  }, []);

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
