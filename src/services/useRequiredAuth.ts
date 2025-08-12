import { useEffect } from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";
import { useScreen } from "@/screens/ScreensProvider";

export default function useRequiredAuth() {
  const { isAnonymous } = useCurrentUser();
  const { currentScreenName, setCurrentScreenName } = useScreen();

  useEffect(() => {
    if (isAnonymous) {
      console.log("go to login from", currentScreenName);
      setCurrentScreenName("Login", {
        state: {
          targetScreenName: currentScreenName,
        },
      });
    }
  }, [isAnonymous, setCurrentScreenName, currentScreenName]);

  return isAnonymous;
}
