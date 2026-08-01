import { Outlet, useLocation, Link, useNavigation } from "react-router-dom";
import useNavigate from "@/services/useNavigate";

import Button from "@/components/Button";
import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import Tabs from "@/components/Tabs";
import { useTranslations } from "@/i18n";

export default function GalleryLayout() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const { translate } = useTranslations();

  const activeTab = useLocation().pathname;

  return (
    <div>
      <h2>{translate("all-photos.title")}</h2>

      <div style={{ margin: "24px 0" }}>
        <Tabs
          activeTab={activeTab}
          tabs={[
            {
              children: (
                <div>
                  <img src="./ui/my-photos.avif" alt="" />{" "}
                  {translate("gallery.tab.photos")}
                </div>
              ),
              value: "/gallery/photos",
              to: "/gallery/photos",
              preventScrollReset: true,
            },
            {
              children: (
                <div>
                  <img src="./ui/my-albums.png" alt="" />{" "}
                  {translate("gallery.tab.albums")}
                </div>
              ),
              value: "/gallery/albums",
              to: "/gallery/albums",
              preventScrollReset: true,
            },
          ]}
          tabComponent={Link}
          variant="chips"
        />
      </div>

      {state === "loading" ? <Loader /> : <Outlet />}
    </div>
  );
}
