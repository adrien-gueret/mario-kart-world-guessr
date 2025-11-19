import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";

import { CurrentUserProvider } from "@/auth/CurrentUserProvider";

import Credits from "@/components/Credits";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import NewVersionModal from "@/versions/NewVersionModal";

function MainLayout() {
  const location = useLocation();

  const isOnHome = location.pathname === "/";

  return (
    <CurrentUserProvider>
      <ScrollRestoration />
      <Header showHomeButton={!isOnHome} />
      <div className="app-container">
        <Logo isBig={isOnHome} />
        <Outlet />
        <Credits />
      </div>
      <NewVersionModal />
      <Footer />
    </CurrentUserProvider>
  );
}

export default MainLayout;
