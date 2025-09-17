import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useCurrentUser } from "@/auth/CurrentUserProvider";
import fetchApi from "@/services/api";

type NotificationsContextType = {
  unreadNotificationCount: number;
  readOneNotification: () => void;
};

const NotificationsContext = createContext<NotificationsContextType>({
  unreadNotificationCount: 0,
  readOneNotification: () => {},
} as NotificationsContextType);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const { isAnonymous } = useCurrentUser();

  const readOneNotification = useCallback(() => {
    setNotificationCount((count) => Math.max(0, count - 1));
  }, []);

  const fetchNotificationCount = useCallback(async () => {
    if (isAnonymous) {
      return;
    }

    const response = await fetchApi("/notifications");
    const notifications = await response.json();
    setNotificationCount(Math.min(99, notifications.length));
  }, [isAnonymous]);

  useEffect(() => {
    fetchNotificationCount();
    const clock = window.setInterval(fetchNotificationCount, 60000);

    return () => {
      window.clearInterval(clock);
    };
  }, [fetchNotificationCount]);

  return <NotificationsContext value={{ unreadNotificationCount: notificationCount, readOneNotification }}>{children}</NotificationsContext>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }

  return context;
}


