import { useState } from "react";

import Button from "@/components/Button";
import { useTranslations } from "@/i18n";

import { useNotifications } from "../NotificationsProvider";

import "./NotificationItem.css";

type Props = {
  notificationId: number;
  title: string;
  dateTime: string;
  image: React.ReactNode;
  children: React.ReactNode;
};

export default function NotificationItem({
  notificationId,
  title,
  dateTime,
  image,
  children,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { readNotification } = useNotifications();
  const { currentLocale, translate } = useTranslations();
  const date = new Date(dateTime);
  const dateFormatter = new Intl.DateTimeFormat(currentLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat(currentLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date);

  const deleteNotification = async () => {
    setIsDeleting(true);
    await readNotification(notificationId);
  };

  return (
    <div className="notification-item">
      <picture className="notification-item-image">{image}</picture>
      <div className="notification-item-body">
        <h3 className="notification-item-title">{title}</h3>
        <p className="notification-item-content">{children}</p>
        <time className="notification-item-time" dateTime={dateTime}>
          {formattedDate} - {formattedTime}
        </time>
        <Button
          className="notification-item-button"
          variant="tertiary"
          onClick={deleteNotification}
          disabled={isDeleting}
        >
          {isDeleting
            ? translate("notifications.deleting")
            : translate("notification.delete")}
        </Button>
      </div>
    </div>
  );
}
