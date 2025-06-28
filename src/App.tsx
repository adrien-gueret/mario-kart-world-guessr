import Button from "@/components/Button";
import Logo from "@/components/Logo";
import Credits from "@/components/Credits";

import { useTranslations } from "./i18n";

import { useScreen } from "@/screens/ScreensProvider";

function App() {
  const { currentScreenName, setCurrentScreenName, CurrentScreen } =
    useScreen();

  const { translate } = useTranslations();

  return (
    <div className={`App App-${currentScreenName}`}>
      <Button
        className="app-home-button"
        onClick={() => setCurrentScreenName("Title")}
        variant="secondary"
      >
        {translate("home.button")}
      </Button>
      <Logo />
      <CurrentScreen />
      <Credits />
    </div>
  );
}

export default App;
