import PusherServer from "pusher";
import Pusher from "pusher-js";

let pusherServerInstance: PusherServer | undefined;
let pusherClientInstance: Pusher | undefined;

const getPusherServer = (): PusherServer => {
  if (!pusherServerInstance) {
    pusherServerInstance = new PusherServer({
      appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
      secret: process.env.PUSHER_SECRET_KEY!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      key: process.env.NEXT_PUBLIC_PUSHER_PUBLISHABLE_KEY!,
      useTLS: true,
    });
  }
  return pusherServerInstance;
};

const getPusherClient = (): Pusher => {
  if (typeof window === "undefined") return {} as Pusher;

  if (!pusherClientInstance) {
    pusherClientInstance = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_PUBLISHABLE_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
      }
    );
  }
  return pusherClientInstance;
};

export const pusherServer = getPusherServer();
export const pusherClient = getPusherClient();
