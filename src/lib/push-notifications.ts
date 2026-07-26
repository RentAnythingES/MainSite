type NotificationPayload = {
  title: string;
  body: string;
  url?: string;
};

function canUseWebNotifications() {
  return typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted";
}

export async function requestBrowserNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function showBookingPushNotification(payload: NotificationPayload) {
  if (!canUseWebNotifications()) return;

  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: "/brand/favicon.ico",
  });

  if (payload.url) {
    notification.onclick = () => {
      window.open(payload.url, "_blank", "noopener,noreferrer");
    };
  }
}
