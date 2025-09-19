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

import type { Notification } from "./types";

type NotificationsContextType = {
  isLoading: boolean;
  allNotifications: Notification[];
  unreadNotificationCount: number;
  readNotification: (notificationId: number) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType>({
  isLoading: false,
  allNotifications: [],
  unreadNotificationCount: 0,
  readNotification: async () => {},
} as NotificationsContextType);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  const { isAnonymous } = useCurrentUser();

  const readNotification = useCallback(
    async (notificationId: number) => {
      if (isAnonymous) {
        return;
      }

      const formData = new FormData();
      formData.append("notificationId", String(notificationId));
      const response = await fetchApi("/notification", "DELETE", formData);
      const newNotifications = await response.json();
      setAllNotifications(newNotifications);
    },
    [isAnonymous]
  );

  const fetchNotifications = useCallback(async () => {
    if (isAnonymous) {
      return;
    }

    setIsLoading(true);
    const response = await fetchApi("/notifications");
    const notifications = await response.json();
    setAllNotifications(notifications);
    setIsLoading(false);
  }, [isAnonymous]);

  useEffect(() => {
    fetchNotifications();
    const clock = window.setInterval(fetchNotifications, 60000);

    return () => {
      window.clearInterval(clock);
    };
  }, [fetchNotifications]);

  return (
    <NotificationsContext
      value={{
        isLoading,
        allNotifications,
        unreadNotificationCount: allNotifications.length,
        readNotification,
      }}
    >
      {children}
    </NotificationsContext>
  );
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
