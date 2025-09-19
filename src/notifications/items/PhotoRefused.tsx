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
          src={`${import.meta.env.VITE_API_ROOT_URL}/photo-proxy?pr_id=${
            notification.specificData.pr_id
          }`}
          alt=""
        />
      }
    >
      {translate("notifications.photo_refused.description")(
        notification.specificData.reason
      )}
    </NotificationItem>
  );
}
