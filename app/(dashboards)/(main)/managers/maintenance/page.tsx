"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MessageSquare, Users } from "lucide-react";
import {
  MaintenanceRequestsTable,
  ReqInfo,
} from "./_components/maintenance-request-table";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getRequestInfoForManager } from "@/data/request";

interface StatCardProp {
  title: string;
  value: string;
  Icon: React.ElementType;
  color: string;
}

// Stat Card Component
const StatCard = ({ title, value, color, Icon }: StatCardProp) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-lg font-nunito font-semibold">
        {title}
      </CardTitle>
      <div
        className={`flex items-center justify-center mb-3 text-${color} p-2 rounded-full bg-${color} bg-opacity-20`}
      >
        <Icon className="h-4 w-4 z-1" />
      </div>
    </CardHeader>
    <CardContent>
      <div className={`text-4xl text-${color} font-bold font-nunito`}>
        {value}
      </div>
    </CardContent>
  </Card>
);

const MaintenancePage = () => {
  const user = useCurrentUser();

  const [requests, setRequests] = useState<ReqInfo[]>([]);
  const [propertyName, setPropertyName] = useState<string | null>(null);

  useEffect(() => {
    const getInfo = async () => {
      const data = await getRequestInfoForManager(user?.id as string);

      if (data && data.property) {
        setPropertyName(data.property.name as string);

        setRequests(data.reqInfo);
      }
    };

    getInfo();
  }, [user?.id]);

  const open = requests.filter((r) => r.status !== "Closed");
  const progress = requests.filter((r) => r.status === "Progress");
  const closed = requests.filter((r) => r.status === "Closed");

  const stats = [
    {
      title: "Open Requests",
      value: `${open.length}`,
      Icon: MessageSquare,
      color: "custom-8",
    },
    {
      title: "In Progress",
      value: `${progress.length}`,
      Icon: Home,
      color: "custom-7",
    },
    {
      title: "Completed",
      value: `${closed.length}`,
      Icon: Users,
      color: "custom-2",
    },
  ];

  return (
    <div className="min-h-screen container mx-auto space-y-6">
      {/* <h1 className="text-3xl font-bold mb-6">Property Management Dashboard</h1> */}

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-nunito font-semibold">
            Maintenance Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MaintenanceRequestsTable
            requests={requests}
            propertyName={propertyName}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
