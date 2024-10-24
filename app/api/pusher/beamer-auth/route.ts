import PushNotifications from "@pusher/push-notifications-server";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const beamsClient = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
  secretKey: process.env.BEAMS_SECRET_KEY!,
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Authorized" }, { status: 401 });
  }

  const beamsToken = beamsClient.generateToken(session.user.id);
  return NextResponse.json(beamsToken);
}
