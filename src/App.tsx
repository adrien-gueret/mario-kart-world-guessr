import Logo from "./components/Logo";
import Credits from "./components/Credits";

import { useScreen } from "./screens/ScreensProvider";

function App() {
  const { currentScreenName, CurrentScreen } = useScreen();

  return (
    <div className={`App App-${currentScreenName}`}>
      <Logo />
      <CurrentScreen />
      <Credits />
    </div>
  );
}

export default App;
