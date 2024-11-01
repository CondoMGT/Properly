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

import { useCallback, useEffect, useState } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

export const useBeams = (userId: string | undefined) => {
  const [isStarted, setIsStarted] = useState(false);

  const start = useCallback(async () => {
    if (!userId || typeof window === "undefined") return;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Feature detection for Notification and Service Worker support
    if (isMobile && (!("Notification" in window) || !navigator.serviceWorker)) {
      console.log("Push notifications are not supported on this mobile device");
      return; // Skip initialization
    }

    if (isMobile) {
      console.log("Pusher Beams not initialized on mobile device");
      return;
    }

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

        if (beamsClient) {
          await beamsClient.start();
          await beamsClient.setUserId(userId, beamsTokenProvider);
          setIsStarted(true);
        }
      } catch (error) {
        console.error("Error starting Beams:", error);
      }
    };

    await startBeams();

    return () => {
      if (isStarted) {
        beamsClient.stop().catch(console.error);
      }
    };
  }, [userId, isStarted]);

  return { start, isStarted };
};
