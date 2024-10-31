"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Calendar, Clock1, Home, MessageSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ReqInfo } from "./maintenance/_components/maintenance-request-table";
import { getRequestInfoForManager } from "@/data/request";
import { useCurrentUser } from "@/hooks/use-current-user";
import { BeatLoader } from "react-spinners";
import { RequestDialog } from "./maintenance/_components/request-dialog";

interface StatCardProp {
  title: string;
  value: string;
  Icon: React.ElementType;
  color: string;
}

interface MaintenanceRequest {
  id?: number;
  title: string;
  status: "Scheduled" | "In Progress" | "Pending" | "Closed";
}

interface ScheduleItemProp {
  title: string;
  time: string;
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
      <div className="text-4xl font-bold font-nunito">{value}</div>
    </CardContent>
  </Card>
);

// Maintenance Request Component
const MaintenanceRequest = ({
  req,
  propertyName,
}: {
  req: ReqInfo;
  propertyName: string;
}) => {
  const statusColors = {
    New: "bg-custom-0",
    Pending: "bg-custom-7",
    Progress: "bg-custom-8",
    Closed: "bg-custom-9",
  };

  const [viewDialog, setViewDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReqInfo | null>(null);

  const handleCloseViewDialog = () => {
    setSelectedRequest(null);
    setViewDialog((prev) => !prev);
  };

  // Normalize the status to lowercase
  const normalizedStatus = req.status as keyof typeof statusColors;

  // Use the normalized status to index into statusColors
  const reqColor = statusColors[normalizedStatus];

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-xl">
        <div className="flex items-center space-x-4">
          <div className={`${reqColor} rounded-full w-6 h-6`} />
          <div className="flex flex-col space-y-2 items-start">
            <span className="text-base tracking-tight leading-normal">
              {req.issue} in Unit {req.user.tenant?.unit}, {propertyName}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              Status: {req.status === "Progress" ? "In Progress" : req.status}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRequest(req);
            setViewDialog(true);
          }}
        >
          View
        </Button>
      </div>

      {selectedRequest && (
        <RequestDialog
          viewDialog={viewDialog}
          setViewDialog={handleCloseViewDialog}
          request={selectedRequest}
          address={propertyName as string}
          canSubmit={false}
        />
      )}
    </>
  );
};

// Schedule Item Component
const ScheduleItem = ({ time, title }: ScheduleItemProp) => (
  <div className="flex items-center space-x-4 py-2">
    <Calendar className="h-6 w-6 text-custom-0" />
    <div className="flex flex-col space-y-2">
      <span className="font-normal leading-normal tracking-tight">{title}</span>
      <span className="font-semibold text-[#555555] text-sm leading-none tracking-tight">
        Today at {time}
      </span>
    </div>
  </div>
);

const ManagerPage = () => {
  const user = useCurrentUser();

  const [requests, setRequests] = useState<ReqInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const [propertyName, setPropertyName] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const getInfo = async () => {
      const data = await getRequestInfoForManager(user?.id as string);

      if (data && data.property) {
        setPropertyName(data.property.name as string);

        const sortedReqInfo = data.reqInfo.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setRequests(sortedReqInfo);
      }

      setLoading(false);
    };

    getInfo();
  }, [user?.id]);

  // Mock data
  const stats = [
    {
      title: "Properties",
      value: "125",
      Icon: Home,
      color: "custom-1",
    },
    {
      title: "Open Requests",
      value: "8",
      Icon: MessageSquare,
      color: "custom-2",
    },
    {
      title: "Tenants",
      value: "312",
      Icon: Users,
      color: "custom-7",
    },
  ];

  const scheduleItems = [
    { time: "9:00am", title: "Property Inspection - 123 Main St" },
    { time: "11:30am", title: "Tenant Meeting - Apt 301" },
    { time: "2:00pm", title: "Maintenance Follow-up - Apt 205" },
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

      {/* Main Content Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Maintenance Requests */}
        <Card className="md:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto space-y-4">
            {loading && (
              <div className="w-full h-full flex items-center justify-center">
                <BeatLoader color="#003366" />
              </div>
            )}
            {!loading && requests.length === 0 && (
              <p>No recent maintenance requests.</p>
            )}
            {!loading &&
              requests.length > 0 &&
              requests.map((request) => (
                <MaintenanceRequest
                  key={request.id}
                  req={request}
                  propertyName={propertyName as string}
                />
              ))}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6 md:space-y-4 flex flex-col">
          {/* Upcoming Schedule */}
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              {scheduleItems.map((item, index) => (
                <ScheduleItem key={index} {...item} />
              ))}
            </CardContent>
          </Card>

          {/* Average Response Time */}
          <Card className="flex-[20%]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold font-nunito">
                Average Response Time
              </CardTitle>
              <Clock1 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mt-10">4.5 hrs</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
