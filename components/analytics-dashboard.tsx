"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  Rectangle,
  PieChart,
  Pie,
  Label,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { maintenanceRquests } from "@/lib/constants";

interface AnalyticsData {
  totalRequests?: number;
  requestsByStatus: { status: string; _count: number }[];
  requestsByUrgency: { urgency: string; _count: number }[];
  averageResolutionTime?: number | null;
}

interface RequestType {
  title: string;
  description: string;
  request_date: number;
  resolved_date: number | null;
  status: string;
  urgency: string;
}

interface StatusCount {
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  _count: number;
}

interface UrgencyCount {
  urgency: "HIGH" | "LOW" | "MEDIUM";
  _count: number;
}

interface CategorizationResult {
  requestsByStatus: StatusCount[];
  requestsByUrgency: UrgencyCount[];
  totalRequests?: number;
  averageResolutionTime?: number | null;
}

const calculateAverageResolutionTime = (requests: RequestType[]): number => {
  // Filter resolved requests
  const resolvedRequests = requests.filter(
    (request) => request.resolved_date !== null
  );

  // Calculate total resolution time in hours
  const totalResolutionTime = resolvedRequests.reduce((total, request) => {
    // Ensure resolved_date is not null
    if (request.resolved_date !== null) {
      const resolutionTime =
        (request.resolved_date - request.request_date) / 3600000; // Convert ms to hours
      return total + resolutionTime;
    }
    return total; // Return total unchanged if resolved_date is null
  }, 0);

  // Calculate average resolution time
  const averageResolutionTime = resolvedRequests.length
    ? totalResolutionTime / resolvedRequests.length
    : 0;

  return Number(averageResolutionTime.toFixed(2));
};

const categorize = (
  // option: "status" | "urgency",
  requests: RequestType[]
): CategorizationResult => {
  const data: CategorizationResult = {
    requestsByStatus: [],
    requestsByUrgency: [],
  };

  const statusMap: {
    [key in "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"]: number;
  } = {
    PENDING: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    CLOSED: 0,
  };

  requests.forEach((request) => {
    const temp = request.status.replace("-", "_").toUpperCase() as
      | "PENDING"
      | "IN_PROGRESS"
      | "RESOLVED"
      | "CLOSED";
    statusMap[temp] += 1;
  });

  for (const [status, _count] of Object.entries(statusMap)) {
    if (_count > 0) {
      data.requestsByStatus.push({
        status: status as StatusCount["status"],
        _count,
      });
    }
  }

  const urgencyMap: {
    [key in "HIGH" | "LOW" | "MEDIUM"]: number;
  } = {
    HIGH: 0,
    LOW: 0,
    MEDIUM: 0,
  };

  requests.forEach((request) => {
    const temp = request.urgency.toUpperCase() as "HIGH" | "LOW" | "MEDIUM";
    urgencyMap[temp] += 1;
  });

  for (const [urgency, _count] of Object.entries(urgencyMap)) {
    if (_count > 0) {
      data.requestsByUrgency.push({
        urgency: urgency as UrgencyCount["urgency"],
        _count,
      });
    }
  }

  return data;
};

const chartConfig = {
  count: {
    label: "Count",
  },
  LOW: {
    label: "Low",
    color: "rgba(255, 99, 132, 0.8)",
  },
  MEDIUM: {
    label: "Medium",
    color: "rgba(54, 162, 235, 0.8)",
  },
  HIGH: {
    label: "High",
    color: "rgba(255, 206, 86, 0.8)",
  },
  PENDING: {
    label: "Pending",
    color: "rgba(255, 99, 132, 0.8)",
  },
  IN_PROGRESS: {
    label: "In Progess",
    color: "rgba(54, 162, 235, 0.8)",
  },
  RESOLVED: {
    label: "Resolved",
    color: "rgba(255, 206, 86, 0.8)",
  },
  CLOSED: {
    label: "Closed",
    color: "rgba(75, 192, 192, 0.8)",
  },
} satisfies ChartConfig;

const dummyData: AnalyticsData = {
  totalRequests: 150,
  requestsByStatus: [
    { status: "PENDING", _count: 30 },
    { status: "IN_PROGRESS", _count: 45 },
    { status: "RESOLVED", _count: 60 },
    { status: "CLOSED", _count: 15 },
  ],
  requestsByUrgency: [
    { urgency: "LOW", _count: 50 },
    { urgency: "MEDIUM", _count: 70 },
    { urgency: "HIGH", _count: 30 },
  ],
  averageResolutionTime: 48.5,
};

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // fetchAnalyticsData()
    const data = categorize(maintenanceRquests);
    const averageTime = calculateAverageResolutionTime(maintenanceRquests);

    const totalCount = maintenanceRquests.length;

    if (data) {
      data.averageResolutionTime = averageTime;
      data.totalRequests = totalCount;
      setAnalyticsData(data);
    }
  }, []);

  // const fetchAnalyticsData = async () => {
  //   try {
  //     const response = await fetch('/api/analytics')
  //     if (response.ok) {
  //       const data = await response.json()
  //       setAnalyticsData(data)
  //     } else {
  //       setError('Failed to fetch analytics data')
  //       // Use dummy data if API fails
  //       setAnalyticsData(dummyData)
  //     }
  //   } catch (error) {
  //     setError('An error occurred. Please try again.')
  //     // Use dummy data if API fails
  //     setAnalyticsData(dummyData)
  //   }
  // }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!analyticsData) {
    return <div>Loading analytics data...</div>;
  }

  const statusData = analyticsData.requestsByStatus.map((item) => {
    return {
      label: item.status,
      count: item._count,
      fill:
        item.status === "PENDING"
          ? "rgba(255, 99, 132, 0.8)"
          : item.status === "IN_PROGRESS"
          ? "rgba(54, 162, 235, 0.8)"
          : item.status === "RESOLVED"
          ? "rgba(255, 206, 86, 0.8)"
          : "rgba(75, 192, 192, 0.8)",
    };
  });

  const urgencyData = analyticsData.requestsByUrgency.map((item) => {
    return {
      label: item.urgency,
      count: item._count,
      fill:
        item.urgency === "LOW"
          ? "rgba(255, 99, 132, 0.8)"
          : item.urgency === "MEDIUM"
          ? "rgba(54, 162, 235, 0.8)"
          : "rgba(255, 206, 86, 0.8)",
    };
  });

  // const totalCount = useMemo(() => {
  //   return statusData.reduce((acc, curr) => acc + curr.count, 0);
  // }, []);

  // const averageTime = calculateAverageResolutionTime(maintenanceRquests);

  // console.log(categorize(maintenanceRquests));

  return (
    <div className="space-y-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Total Requests</h3>
          <p className="text-4xl font-bold">{maintenanceRquests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Average Resolution Time
          </h3>
          <p className="text-4xl font-bold">
            {analyticsData.averageResolutionTime
              ? `${analyticsData.averageResolutionTime} hours`
              : "N/A"}
          </p>
        </div>

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pie Chart - Donut with Text</CardTitle>
            <CardDescription>Requests by Status</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {analyticsData.totalRequests?.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Requests
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total counts of request for the last 6 months
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - Active</CardTitle>
            <CardDescription>Requests by Urgency</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={urgencyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  strokeWidth={2}
                  radius={8}
                  activeIndex={2}
                  activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke={props.payload.fill}
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    );
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing count of maintenance requests by urgency
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
