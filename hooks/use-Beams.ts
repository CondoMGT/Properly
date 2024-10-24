// import { useEffect, useState } from "react";
// import * as PusherPushNotifications from "@pusher/push-notifications-web";

// const beamsClient = new PusherPushNotifications.Client({
//   instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
// });

// const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
//   url: "/api/pusher/beamer-auth",
// });

// export const useBeams = (userId: string | undefined) => {
//   const [isStarted, setIsStarted] = useState(false);

//   useEffect(() => {
//     if (!userId || typeof window === "undefined") return;

//     const requestPermission = async () => {
//       const permission = await Notification.requestPermission();
//       return permission === "granted";
//     };

//     const startBeams = async () => {
//       try {
//         const permissionGranted = await requestPermission();
//         if (!permissionGranted) {
//           console.error("User denied permission for notifications.");
//           return;
//         }

//         await beamsClient.start();
//         setIsStarted(true);
//         await beamsClient.setUserId(userId, beamsTokenProvider);
//       } catch (error) {
//         console.error("Error starting Beams:", error);
//       }
//     };

//     startBeams();

//     return () => {
//       if (isStarted) {
//         beamsClient.stop().catch(console.error);
//       }
//     };
//   }, [userId, isStarted]);
// };

import { useEffect, useState } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

export const useBeams = (userId: string | undefined) => {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;

    const beamsClient = new PusherPushNotifications.Client({
      instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
    });

    const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
      url: "/api/pusher/beamer-auth",
    });

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    };

    const startBeams = async () => {
      try {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) {
          console.error("User denied permission for notifications.");
          return;
        }

        await beamsClient.start();
        setIsStarted(true);
        await beamsClient.setUserId(userId, beamsTokenProvider);
      } catch (error) {
        console.error("Error starting Beams:", error);
      }
    };

    startBeams();

    return () => {
      if (isStarted) {
        beamsClient.stop().catch(console.error);
      }
    };
  }, [userId, isStarted]);
};
