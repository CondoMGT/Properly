"use server";

import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function pusherAuth(socketId: string, channel: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userData = {
    user_id: session.user.id,
    user_info: {
      name: session.user.name,
      email: session.user.email,
    },
  };

  const authResponse = pusherServer.authorizeChannel(
    socketId,
    channel,
    userData
  );

  return new Response(JSON.stringify(authResponse));
}
