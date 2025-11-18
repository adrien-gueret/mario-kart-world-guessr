import { Outlet } from "react-router-dom";

import Credits from "@/components/Credits";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Logo from "@/components/Logo";

import NewVersionModal from "@/versions/NewVersionModal";

function HomeLayout() {
  return (
    <div className="app-Home">
      <Header />
      <div className="app-container">
        <Logo />
        <Outlet />
        <Credits />
      </div>
      <NewVersionModal />
      <Footer />
    </div>
  );
}

export default HomeLayout;
