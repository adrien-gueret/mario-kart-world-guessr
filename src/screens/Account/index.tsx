import Button from "@/components/Button";

import ConstraintContainer from "@/components/ConstraintContainer";
import Tabs from "@/components/Tabs";
import { useTranslations } from "@/i18n";
import { useNotifications } from "@/notifications/NotificationsProvider";
import { useScreen, type ScreenName } from "@/screens/ScreensProvider";
import useRequiredAuth from "@/services/useRequiredAuth";

import Preferences from "./Preferences";


type Props = {
  activeTab?: Extract<
    ScreenName,
    "Account/Preferences" | "Account/Notifications" | "Account/Photos"
  >;
};

export default function Account({ activeTab = "Account/Preferences" }: Props) {
  const { setCurrentScreenName } = useScreen();
  const { translate } = useTranslations();
  const { unreadNotificationCount } = useNotifications();

  const isAnonymous = useRequiredAuth();

  if (isAnonymous) {
    return null;
  }

  const tabToContent: Record<
    NonNullable<Props["activeTab"]>,
    React.ReactNode
  > = {
    "Account/Photos": <div>Soon</div>,
    "Account/Preferences": <Preferences />,
    "Account/Notifications": <div>Soon</div>,
  };

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
              value: "Account/Preferences",
              href: "#/account/preferences",
            },
            {
              children: (
                <div>
                  <img src="./ui/my-photos.avif" alt="" />{" "}
                  {translate("account.tab.photos")}
                </div>
              ),
              value: "Account/Photos",
              href: "#/account/photos",
            },
            {
              children: (
                <div>
                  <img src="./ui/notifications.avif" alt="" />{" "}
                  {translate("account.tab.notifications")}{unreadNotificationCount > 0 && ` (${unreadNotificationCount})`}
                </div>
              ),
              value: "Account/Notifications",
              href: "#/account/notifications",
            },
          ]}
          tabComponent="a"
          variant="chips"
        />
      </div>

      <ConstraintContainer>
        {tabToContent[activeTab]}

        <div className="back-button">
          <Button
            variant="secondary"
            onClick={() => setCurrentScreenName("Play")}
          >
            {translate("play.label")}
          </Button>
        </div>
      </ConstraintContainer>
    </div>
  );
}
