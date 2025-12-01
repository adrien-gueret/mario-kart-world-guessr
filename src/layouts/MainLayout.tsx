import {
  Outlet,
  ScrollRestoration,
  useNavigation,
  useOutlet,
  useOutletContext,
} from "react-router-dom";

import { CurrentUserProvider } from "@/auth/CurrentUserProvider";

import Credits from "@/components/Credits";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Logo, { type Props as LogoProps } from "@/components/Logo";
import NewVersionModal from "@/versions/NewVersionModal";

type Props = {
  shouldHideHomeButton?: boolean;
  shouldHideHeader?: boolean;
  logoVariant?: LogoProps["variant"];
  enableLoader?: boolean;
};

function MainLayout({
  logoVariant = "default",
  shouldHideHomeButton = false,
  shouldHideHeader = false,
  enableLoader = false,
}: Props) {
  const { state } = useNavigation();

  return (
    <CurrentUserProvider>
      <ScrollRestoration />
      {!shouldHideHeader && <Header showHomeButton={!shouldHideHomeButton} />}
      <div className="app-container">
        <Logo variant={logoVariant} />

        {enableLoader && state === "loading" ? <Loader /> : <Outlet />}

        <Credits />
      </div>
      <NewVersionModal />
      <Footer />
    </CurrentUserProvider>
  );
}

export default MainLayout;
