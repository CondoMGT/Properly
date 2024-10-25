"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";

const dashItems = [
  {
    name: "Active Requests",
    count: 1,
    color: "text-custom-7",
  },
  {
    name: "Resolved Issues",
    count: 1,
    color: "text-custom-9",
  },
  {
    name: "Unread Messages",
    count: 2,
    color: "text-custom-8",
  },
];

const TenantPage = () => {
  const user = useCurrentUser();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-nunito text-3xl">
          Welcome, {user?.name}!
        </CardTitle>
        <CardDescription>
          Here&apos; an overview of your recent activity.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pr-8">
        {dashItems.map((item) => (
          <div key={item.name} className="flex justify-between items-center">
            <span className="font-semibold text-2xl font-nunito">
              {item.name}:
            </span>
            <span
              className={`font-semibold text-4xl font-nunito ${item.color}`}
            >
              {item.count}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TenantPage;
