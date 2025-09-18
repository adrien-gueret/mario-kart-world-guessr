import { useTranslations } from "@/i18n";
import Surface from "@/components/Surface";
import { useNotifications, NotificationFactory } from "@/notifications";

export default function Notifications() {
  const { translate } = useTranslations();
  const { allNotifications } = useNotifications();

  return (
    <>
      <div>
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
      </div>
    </>
  );
}
