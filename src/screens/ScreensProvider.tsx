import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type ElementType,
} from "react";

import { flushSync } from "react-dom";

import { SurvivalGame, GoalGame, DailyGame } from "./Game";
import Title from "./Title";

export type ScreenName = "Title" | "SurvivalGame" | "GoalGame" | "DailyGame";

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

export function ScreensProvider({ children }: { children: ReactNode }) {
  const [currentScreenName, setCurrentScreenName] =
    useState<ScreenName>("Title");

  const ScreenNameToScreen: Record<ScreenName, ElementType> = {
    Title,
    SurvivalGame,
    GoalGame,
    DailyGame,
  };

  const goToScreen = useCallback((screenName: ScreenName) => {
    document.startViewTransition(() => {
      flushSync(() => {
        setCurrentScreenName(screenName);
      });
    });
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
