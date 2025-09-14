import { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "@/auth/CurrentUserProvider";
import { useTranslations } from "@/i18n";
import fetchApi from "@/services/api";

import "./ConnectedUserHeaderItem.css";

export default function ConnectedUserHeaderItem() {
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, logout } = useCurrentUser();
  const { translate } = useTranslations();

  const fetchNotificationCount = useCallback(async () => {
    const response = await fetchApi("/notifications");
    const notifications = await response.json();
    setNotificationCount(notifications.length);
  }, []);

  useEffect(() => {
    fetchNotificationCount();
    const clock = window.setInterval(fetchNotificationCount, 60000);

    return () => {
      window.clearInterval(clock);
    };
  }, [fetchNotificationCount]);

  return (
    <div className="connected-user-header-item">
      {notificationCount > 0 && (
        <a
          className="notification-badge"
          href="#/notifications"
          title={translate("notifications.title")}
        >
          <b>{Math.min(notificationCount, 99)}</b>
        </a>
      )}
      {user.marioCharacter && (
        <img
          style={{ width: "32px", verticalAlign: "text-bottom" }}
          src={`./ui/pins/icon-${user.marioCharacter}.png`}
          alt=""
        />
      )}
      <a href="#/account">
        <b>{user.username}</b>
      </a>
      &bull;
      <a href="#" onClick={logout}>
        {translate("logout.label")}
      </a>
    </div>
  );
}
