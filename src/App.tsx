import Logo from "./components/Logo";

import { useScreen } from "./screens/ScreensProvider";

function App() {
  const { currentScreenName, CurrentScreen } = useScreen();

  return (
    <div className={`App App-${currentScreenName}`}>
      <Logo />
      <CurrentScreen />
    </div>
  );
}

export default App;
