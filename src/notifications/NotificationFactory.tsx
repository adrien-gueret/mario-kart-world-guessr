import type { Notification } from "./types";

import PhotoRefused from "./items/PhotoRefused";
import PhotoValidated from "./items/PhotoValidated";

export default function NotificationFactory({
  notification,
}: {
  notification: Notification;
}) {
  switch (notification.type) {
    case "photo_validated":
      return <PhotoValidated notification={notification} />;
    case "photo_refused":
      return <PhotoRefused notification={notification} />;
    default:
      return null;
  }
}
