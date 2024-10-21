import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Calendar, Clock1, Home, MessageSquare, Users } from "lucide-react";

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
const MaintenanceRequest = ({ title, status }: MaintenanceRequest) => {
  const statusColors = {
    scheduled: "bg-custom-0",
    pending: "bg-custom-7",
    in_progress: "bg-custom-8",
    closed: "bg-custom-9",
  };

  // Normalize the status to lowercase
  const normalizedStatus = status
    .toLowerCase()
    .replace(" ", "_") as keyof typeof statusColors;

  // Use the normalized status to index into statusColors
  const reqColor = statusColors[normalizedStatus];

  return (
    <div className="flex items-center justify-between p-4 border rounded-xl">
      <div className="flex items-center space-x-4">
        <div className={`${reqColor} rounded-full w-6 h-6`} />
        <div className="flex flex-col space-y-2 items-start">
          <span className="text-base tracking-tight leading-normal">
            {title}
          </span>
          <span className="text-sm font-semibold text-gray-600">
            Status: {status}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        // onClick={onView}
      >
        View
      </Button>
    </div>
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
  // Mock data
  const stats = [
    {
      title: "Total Properties",
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
      title: "Active Tenants",
      value: "312",
      Icon: Users,
      color: "custom-7",
    },
  ];

  const maintenanceRequests: MaintenanceRequest[] = [
    { id: 1, title: "Leaky Faucet - Apt 301", status: "Scheduled" },
    { id: 2, title: "Water Leak in Unit 201 Building B", status: "Scheduled" },
    { id: 3, title: "Broken AC in Unit 422 Building B", status: "In Progress" },
    {
      id: 4,
      title: "Broken Kitchen Vent in Unit 854 Building D",
      status: "In Progress",
    },
    { id: 5, title: "Lobby Light Replacement Building A", status: "Pending" },
    { id: 6, title: "Kitchen Faucet in Unit 601 Building C", status: "Closed" },
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
            <CardTitle>Maintenance Requests</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto space-y-4">
            {maintenanceRequests.map((request) => (
              <MaintenanceRequest
                key={request.id}
                {...request}
                // onView={() => console.log(`View request ${request.id}`)}
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
