import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";

import Credits from "@/components/Credits";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import NewVersionModal from "@/versions/NewVersionModal";

import Providers from "@/Providers";

function MainLayout() {
  const location = useLocation();

  const isOnHome = location.pathname === "/";

  return (
    <Providers>
      <ScrollRestoration />
      <Header showHomeButton={!isOnHome} />
      <div className="app-container">
        <Logo isBig={isOnHome} />
        <Outlet />
        <Credits />
      </div>
      <NewVersionModal />
      <Footer />
    </Providers>
  );
}

export default MainLayout;
