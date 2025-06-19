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
import Title from "./Title";
import Upload from "./Upload";

export type ScreenName = "Title" | "SurvivalGame" | "GoalGame" | "DailyGame" | "Upload";
type ScreenHashtag = `#/${Lowercase<ScreenName>}`;

const screenHashtagsToScreenNames: Record<ScreenHashtag, ScreenName> = {
  "#/title": "Title",
  "#/survivalgame": "SurvivalGame",
  "#/goalgame": "GoalGame",
  "#/dailygame": "DailyGame",
  "#/upload": "Upload",
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

const getScreenNameFromHash = (): ScreenName | null => {
  const newHash = window.location.hash as ScreenHashtag;

  const newScreenName = newHash
    ? screenHashtagsToScreenNames[newHash]
    : "Title";

  return newScreenName || null;
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
  };

  const goToScreen = useCallback((screenName: ScreenName) => {
    window.location.hash = `/${screenName.toLowerCase()}`;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const newScreenName = getScreenNameFromHash();

      if (newScreenName) {
        document.startViewTransition(() => {
          flushSync(() => {
            setCurrentScreenName(newScreenName);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          });
        });
      }
    };

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
