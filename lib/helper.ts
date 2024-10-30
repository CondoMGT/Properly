export const createSentenceCase = (val: string) => {
  return val[0].toUpperCase() + val.slice(1);
};

type NotificationPayload = {
  title: string;
  body: string;
  icon?: string;
};

export const handleNotification = (payload: NotificationPayload) => {
  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon,
  });

  notification.onclick = () => {
    console.log("Notification clicked");
  };
};
