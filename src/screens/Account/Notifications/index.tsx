import { useState } from "react";
import { useTranslations } from "@/i18n";
import Button from "@/components/Button";
import ConstraintContainer from "@/components/ConstraintContainer";
import Loader from "@/components/Loader";
import Surface from "@/components/Surface";
import { useNotifications, NotificationFactory } from "@/notifications";

export default function Notifications() {
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const { translate } = useTranslations();
  const { allNotifications, isLoading, clearNotifications } =
    useNotifications();

  return isLoading ? (
    <Loader />
  ) : (
    <ConstraintContainer>
      {allNotifications.length === 0 ? (
        <Surface>
          <p>{translate("notifications.none")}</p>
        </Surface>
      ) : (
        <>
          {allNotifications.length > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              <Button
                onClick={async () => {
                  setIsDeletingAll(true);
                  await clearNotifications();
                  setIsDeletingAll(false);
                }}
                variant="tertiary"
                disabled={isDeletingAll}
              >
                {isDeletingAll
                  ? translate("notifications.deleting")
                  : translate("notifications.clear_all")}
              </Button>
            </div>
          )}

          {allNotifications.map((notification) => (
            <NotificationFactory
              key={notification.id}
              notification={notification}
            />
          ))}
        </>
      )}
    </ConstraintContainer>
  );
}
