import { Outlet, useLocation, Link, useNavigation } from "react-router-dom";
import useNavigate from "@/services/useNavigate";

import Button from "@/components/Button";
import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import Tabs from "@/components/Tabs";
import { useTranslations } from "@/i18n";
import { useNotifications } from "@/notifications/NotificationsProvider";
import useRequiredAuth from "@/services/useRequiredAuth";

export default function AccountLayout() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const { translate } = useTranslations();
  const { unreadNotificationCount } = useNotifications();

  const isAnonymous = useRequiredAuth();

  const activeTab = useLocation().pathname;

  if (isAnonymous) {
    return null;
  }

  return (
    <div>
      <h2>{translate("account.title")}</h2>

      <div style={{ margin: "24px 0" }}>
        <Tabs
          activeTab={activeTab}
          tabs={[
            {
              children: (
                <div>
                  <img src="./ui/preferences.avif" alt="" />{" "}
                  {translate("account.tab.preferences")}
                </div>
              ),
              value: "/account/preferences",
              to: "/account/preferences",
              preventScrollReset: true,
            },
            {
              children: (
                <div>
                  <img src="./ui/my-photos.avif" alt="" />{" "}
                  {translate("account.tab.photos")}
                </div>
              ),
              value: "/account/photos",
              to: "/account/photos",
              preventScrollReset: true,
            },
            {
              children: (
                <div>
                  <img src="./ui/notifications.avif" alt="" />{" "}
                  {translate("account.tab.notifications")}
                  {unreadNotificationCount > 0 &&
                    ` (${unreadNotificationCount})`}
                </div>
              ),
              value: "/account/notifications",
              to: "/account/notifications",
              preventScrollReset: true,
            },
          ]}
          tabComponent={Link}
          variant="chips"
        />
      </div>

      {state === "loading" ? <Loader /> : <Outlet />}

      <ConstraintContainer>
        <div className="back-button">
          <Button variant="secondary" onClick={() => navigate("/play")}>
            {translate("play.label")}
          </Button>
        </div>
      </ConstraintContainer>
    </div>
  );
}
