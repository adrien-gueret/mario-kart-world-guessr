import { useTranslations } from "@/i18n";
import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import Surface from "@/components/Surface";
import { useNotifications, NotificationFactory } from "@/notifications";

export default function Notifications() {
  const { translate } = useTranslations();
  const { allNotifications, isLoading } = useNotifications();

  return isLoading ? (
    <Loader />
  ) : (
    <ConstraintContainer>
      {allNotifications.length === 0 ? (
        <Surface>
          <p>{translate("notifications.none")}</p>
        </Surface>
      ) : (
        allNotifications.map((notification) => (
          <NotificationFactory
            key={notification.id}
            notification={notification}
          />
        ))
      )}
    </ConstraintContainer>
  );
}
