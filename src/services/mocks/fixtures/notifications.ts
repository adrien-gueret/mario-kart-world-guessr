import type { Notification } from "@/notifications/types";

export const notifications: Notification[] = [
  {
    id: 1,
    type: "photo_validated",
    createdAt: "2026-01-30T08:15:00.000Z",
    specificData: { photo_id: "photo-1" },
  },
  {
    id: 2,
    type: "photo_refused",
    createdAt: "2026-01-28T16:40:00.000Z",
    specificData: {
      photo_id: "photo-6",
      reason: "La photo est trop floue pour être exploitable.",
    },
  },
];
