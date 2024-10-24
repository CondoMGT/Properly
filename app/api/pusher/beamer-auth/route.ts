import PushNotifications from "@pusher/push-notifications-server";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const instanceId = process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID;
  const secretKey = process.env.BEAMS_SECRET_KEY;

  if (!instanceId || !secretKey) {
    throw new Error(
      "Environment variables for Push Notifications are not set."
    );
  }

  const beamsClient = new PushNotifications({
    instanceId,
    secretKey,
  });

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const beamsToken = beamsClient.generateToken(session.user.id);
  return NextResponse.json(beamsToken);
}
