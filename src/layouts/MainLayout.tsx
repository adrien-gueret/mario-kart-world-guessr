import { Outlet } from "react-router-dom";

import Credits from "@/components/Credits";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import NewVersionModal from "@/versions/NewVersionModal";

import Providers from "@/Providers";

function MainLayout() {
  return (
    <Providers>
      <div>
        <Header showHomeButton />
        <div className="app-container">
          <Logo />
          <Outlet />
          <Credits />
        </div>
        <NewVersionModal />
        <Footer />
      </div>
    </Providers>
  );
}

export default MainLayout;
