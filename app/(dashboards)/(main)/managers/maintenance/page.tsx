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
import { BeatLoader, RingLoader } from "react-spinners";
import { pusherClient } from "@/lib/pusher";

interface StatCardProp {
  title: string;
  value: string;
  Icon: React.ElementType;
  color: string;
  loading: boolean;
}

// Stat Card Component
const StatCard = ({ title, value, color, Icon, loading }: StatCardProp) => (
  <Card className={`cursor-pointer hover:bg-${color} hover:bg-opacity-5`}>
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
      {loading && <RingLoader size={30} color="#003366" />}
      {!loading && (
        <div className={`text-4xl text-${color} font-bold font-nunito`}>
          {value}
        </div>
      )}
    </CardContent>
  </Card>
);

const MaintenancePage = () => {
  const user = useCurrentUser();

  const [loading, setLoading] = useState(false);

  const [requests, setRequests] = useState<ReqInfo[]>([]);
  const [propertyName, setPropertyName] = useState<string | null>(null);

  const [stats, setStats] = useState({
    open: 0,
    progress: 0,
    closed: 0,
  });

  const updateCounts = (reqInfo: ReqInfo[]) => {
    const openReqs = reqInfo.filter((r) => r.status !== "Closed");
    const progressReqs = reqInfo.filter((r) => r.status === "Progress");
    const closedReqs = reqInfo.filter((r) => r.status === "Closed");

    setStats({
      open: openReqs.length,
      progress: progressReqs.length,
      closed: closedReqs.length,
    });
  };

  useEffect(() => {
    setLoading(true);
    const getInfo = async () => {
      const data = await getRequestInfoForManager(user?.id as string);

      if (data && data.property) {
        setPropertyName(data.property.name as string);

        setRequests(data.reqInfo as ReqInfo[]);

        updateCounts(data.reqInfo as ReqInfo[]);

        setLoading(false);
      }
    };

    getInfo();

    pusherClient.subscribe("maintenance");

    pusherClient.bind(
      "update",
      ({ data, action }: { data: ReqInfo; action: string }) => {
        setRequests((prev) => {
          let updatedRequests;
          if (action === "New Request") {
            // Check if the request already exists
            const exists = prev.some((req) => req.id === data.id);
            if (!exists) {
              updatedRequests = [data, ...prev];
            } else {
              updatedRequests = prev;
            }
          } else {
            updatedRequests = prev.map((p) =>
              p.id === data.id ? { ...p, ...data } : p
            );
          }
          updateCounts(updatedRequests);
          return updatedRequests;
        });
      }
    );

    return () => {
      pusherClient.unsubscribe("maintenance");
    };
  }, [user?.id]);

  const statCards = [
    {
      title: "Open Requests",
      value: `${stats.open}`,
      Icon: MessageSquare,
      color: "custom-8",
    },
    {
      title: "In Progress",
      value: `${stats.progress}`,
      Icon: Home,
      color: "custom-7",
    },
    {
      title: "Completed",
      value: `${stats.closed}`,
      Icon: Users,
      color: "custom-2",
    },
  ];

  return (
    <div className="min-h-screen container mx-auto space-y-6 pb-4">
      {/* <h1 className="text-3xl font-bold mb-6">Property Management Dashboard</h1> */}

      {/* StatCards Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-nunito font-semibold">
              Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <BeatLoader color="#003366" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <MaintenanceRequestsTable
          requests={requests}
          propertyName={propertyName}
        />
      )}
    </div>
  );
};

export default MaintenancePage;
