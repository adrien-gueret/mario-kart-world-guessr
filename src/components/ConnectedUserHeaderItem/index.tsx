import { useCurrentUser } from "@/auth/CurrentUserProvider";
import { useTranslations } from "@/i18n";
import { useNotifications } from "@/notifications";

import "./ConnectedUserHeaderItem.css";

export default function ConnectedUserHeaderItem() {
  const { unreadNotificationCount } = useNotifications();
  
  const { user, logout } = useCurrentUser();
  const { translate } = useTranslations();

  return (
    <div className="connected-user-header-item">
      {unreadNotificationCount > 0 && (
        <a
          className="notification-badge"
          href="#/account/notifications"
          title={translate("notifications.title")}
        >
          <b>{unreadNotificationCount}</b>
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
