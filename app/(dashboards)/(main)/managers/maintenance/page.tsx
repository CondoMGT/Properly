import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MessageSquare, Users } from "lucide-react";
import MaintenanceRequestsTable from "./_components/maintenance-request-table";

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
      <div className="text-4xl font-bold font-nunito">{value}</div>
    </CardContent>
  </Card>
);

const MaintenancePage = () => {
  const stats = [
    {
      title: "Open Requests",
      value: "8",
      Icon: MessageSquare,
      color: "custom-2",
    },
    {
      title: "In Progress",
      value: "3",
      Icon: Home,
      color: "custom-1",
    },
    {
      title: "Completed",
      value: "12",
      Icon: Users,
      color: "custom-7",
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
          <MaintenanceRequestsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
