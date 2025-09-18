type NotificationType = "photo_validated" | "photo_refused";

type NotificationBase<T extends NotificationType, S = null> = {
  id: number;
  type: T;
  createdAt: string;
  specificData: S;
};

export type NotificationPhotoRefused = NotificationBase<
  "photo_refused",
  {
    photo_id: string;
    reason: string;
  }
>;

export type NotificationValidated = NotificationBase<
  "photo_validated",
  {
    photo_id: string;
  }
>;

export type Notification = NotificationPhotoRefused | NotificationValidated;
