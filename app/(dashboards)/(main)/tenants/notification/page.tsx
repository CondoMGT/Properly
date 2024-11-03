"use client";

import { useEffect, useState } from "react";
import { ReqInfo } from "../../managers/maintenance/_components/maintenance-request-table";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getAllRequestInfoForTenant } from "@/data/request";
// import { Loader } from "lucide-react";
import { PulseLoader } from "react-spinners";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { handleNotification } from "@/lib/helper";
import { pusherClient } from "@/lib/pusher";
import { NotificationDrawer } from "./_components/notification-drawer";

const NotificationPage = () => {
  const user = useCurrentUser();

  const [requests, setRequests] = useState<ReqInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState<string[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await getAllRequestInfoForTenant(user?.id as string);

      if (data) {
        setRequests(data);
      }

      setLoading(false);
    };

    fetchRequests();

    const subscribeToMaintenance = () => {
      pusherClient.subscribe("maintenance");

      pusherClient.bind("update", ({ data }: { data: ReqInfo }) => {
        setUpdated((prev) => [...prev, data.id]);
        setRequests((prev) => {
          return prev?.map((p) => {
            if (p.id === data.id) {
              return {
                ...data,
              };
            }
            return p;
          });
        });

        handleNotification({
          title: "Updated Maintenance Request",
          body: "You have an update on a maintenance request",
          icon: "/logo.svg",
        });
      });
    };

    subscribeToMaintenance();

    return () => {
      pusherClient.unsubscribe("maintenance");
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <PulseLoader color="#003366" />
      </div>
    );
  }

  const handleUpdated = (id: string) => {
    setUpdated((prev) => prev.filter((p) => p !== id));
  };

  const sortedRequests = requests.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return (
    <div className="flex flex-col space-y-2">
      {requests.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-nunito">
              You do not have any update or maintenance requests. Check back
              later.
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {requests.length > 0 &&
        sortedRequests.map((r) => (
          <MaintenanceCard
            key={r.id}
            req={r}
            handleUpdated={handleUpdated}
            updated={updated}
          />
        ))}
    </div>
  );
};

export default NotificationPage;

const MaintenanceCard = ({
  req,
  handleUpdated,
  updated,
}: {
  req: ReqInfo;
  handleUpdated: (id: string) => void;
  updated: string[];
}) => {
  const [viewDrawer, setViewDrawer] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<ReqInfo | null>(null);

  const handleCloseViewDrawer = () => {
    setSelectedRequest(null);
    setViewDrawer((prev) => !prev);
  };
  return (
    <>
      <Card
        className={`w-full max-w-4xl mx-auto${
          updated.includes(req.id) && " ring ring-custom-2 animate-pulse"
        }`}
      >
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="flex justify-between items-center font-nunito text-xl">
                Maintenance{" "}
                {req.status === "Closed"
                  ? "Complete"
                  : !req.category && !req.contractor
                  ? "Ticket Created"
                  : req.category && req.contractor
                  ? "Request Scheduling"
                  : "Request Update"}
              </CardTitle>
              <CardDescription className="space-y-2">
                <div>
                  {req.issue}:{" "}
                  {req.status === "Closed"
                    ? "The repair in your unit has been completed. Please review."
                    : !req.category && !req.contractor
                    ? "Your request has been submitted"
                    : req.category && req.contractor && !req.maintenanceDate
                    ? "Confirm date for maintenance request"
                    : req.category && req.contractor && req.maintenanceDate
                    ? "Request Scheduled"
                    : "View request Update"}
                </div>

                <div className="text-sm font-nunito font-semibold">
                  {format(new Date(req.createdAt), "yyyy-MM-dd h:mm a")}
                </div>
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="border-2 border-custom-2 bg-transparent hover:bg-transparent"
              onClick={() => {
                setSelectedRequest(req);
                setViewDrawer(true);
                handleUpdated(req.id);
              }}
            >
              View
            </Button>
          </div>
        </CardHeader>
      </Card>

      {selectedRequest && (
        <NotificationDrawer
          viewDrawer={viewDrawer}
          setViewDrawer={handleCloseViewDrawer}
          request={selectedRequest}
        />
      )}
    </>
  );
};
