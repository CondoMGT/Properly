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

  const [open, setOpen] = useState(0);
  const [progress, setProgress] = useState(0);
  const [closed, setClosed] = useState(0);

  useEffect(() => {
    setLoading(true);
    const getInfo = async () => {
      const data = await getRequestInfoForManager(user?.id as string);

      if (data && data.property) {
        setPropertyName(data.property.name as string);

        setRequests(data.reqInfo);

        updateCounts(data.reqInfo);

        setLoading(false);
      }
    };

    getInfo();
  }, [user?.id]);

  const updateCounts = (reqInfo: ReqInfo[]) => {
    const openReqs = reqInfo.filter((r) => r.status !== "Closed");
    const progressReqs = reqInfo.filter((r) => r.status === "Progress");
    const closedReqs = reqInfo.filter((r) => r.status === "Closed");

    setOpen(openReqs.length);
    setProgress(progressReqs.length);
    setClosed(closedReqs.length);
  };

  useEffect(() => {
    const subscribeToMaintenance = () => {
      pusherClient.subscribe("maintenance");

      pusherClient.bind("update", (data: ReqInfo) => {
        // Update counts based on previous and new status
        setRequests((prev) => {
          const updatedRequests = prev.map((p) =>
            p.id === data.id ? { ...data } : p
          );

          // Update counts based on the updated requests
          updateCounts(updatedRequests);

          return updatedRequests;
        });
      });
    };

    subscribeToMaintenance();

    return () => {
      pusherClient.unsubscribe("maintenance");
    };
  }, []);

  const stats = [
    {
      title: "Open Requests",
      value: `${open}`,
      Icon: MessageSquare,
      color: "custom-8",
    },
    {
      title: "In Progress",
      value: `${progress}`,
      Icon: Home,
      color: "custom-7",
    },
    {
      title: "Completed",
      value: `${closed}`,
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
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-nunito font-semibold">
            Maintenance Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center">
              <BeatLoader color="#003366" />
            </div>
          ) : (
            <MaintenanceRequestsTable
              requests={requests}
              propertyName={propertyName}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
