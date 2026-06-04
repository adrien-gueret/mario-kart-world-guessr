import { useTranslations } from "@/i18n";

import type { NotificationPhotoRefused } from "../types";

import NotificationItem from "./Item";

type Props = {
  notification: NotificationPhotoRefused;
};

export default function PhotoRefused({ notification }: Props) {
  const { translate } = useTranslations();

  return (
    <NotificationItem
      notificationId={notification.id}
      title={translate("notifications.photo_refused.title")}
      dateTime={notification.createdAt}
      image={
        <img
          src={`https://www.mariouniversalis.fr/mario-kart-world-guessr/api/photo-proxy?id=${notification.specificData.photo_id}`}
          alt=""
        />
      }
    >
      {translate("notifications.photo_refused.description")(
        notification.specificData.reason,
      )}
    </NotificationItem>
  );
}
