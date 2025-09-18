import { useTranslations } from "@/i18n";

import type { NotificationValidated } from "../types";

import NotificationItem from "./Item";

type Props = {
  notification: NotificationValidated;
};

export default function PhotoValidated({ notification }: Props) {
  const { translate } = useTranslations();

  return (
    <NotificationItem
      notificationId={notification.id}
      title={translate("notifications.photo_validated.title")}
      dateTime={notification.createdAt}
      image={
        <img
          src={`${import.meta.env.VITE_API_ROOT_URL}/photo-proxy?id=${
            notification.specificData.photo_id
          }`}
          alt=""
        />
      }
    >
      {translate("notifications.photo_validated.description")}
    </NotificationItem>
  );
}
