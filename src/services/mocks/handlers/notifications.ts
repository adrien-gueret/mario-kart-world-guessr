import { db } from "../db";
import { field, jsonResponse } from "../helpers";
import type { MockHandlers } from "../types";

const notificationHandlers: MockHandlers = {
  "GET /notifications": () => jsonResponse(db.notifications),

  "DELETE /notification": ({ body }) => {
    const notificationId = Number(field(body, "notificationId"));
    db.notifications = db.notifications.filter(
      (notification) => notification.id !== notificationId,
    );
    return jsonResponse(db.notifications);
  },

  "DELETE /clear-notifications": () => {
    db.notifications = [];
    return jsonResponse(db.notifications);
  },
};

export default notificationHandlers;
