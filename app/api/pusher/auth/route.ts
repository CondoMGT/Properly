"use server";

import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const socketId = formData.get("socket_id");
    const channel = formData.get("channel_name");

    if (!socketId || !channel) {
      return new Response("Bad request", { status: 400 });
    }

    const userData = {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        email: session.user.email,
      },
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId.toString(),
      channel.toString(),
      userData
    );

    return new Response(JSON.stringify(authResponse));
  } catch (error) {
    console.error("Pusher auth error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
