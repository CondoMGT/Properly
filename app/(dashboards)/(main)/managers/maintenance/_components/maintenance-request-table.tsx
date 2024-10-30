"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Check,
  PlusCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getRequestInfoForManager } from "@/data/request";
import { RequestDialog } from "./request-dialog";
import { RequestStatus } from "@prisma/client";
import { BeatLoader } from "react-spinners";
import { pusherClient } from "@/lib/pusher";
import { handleNotification } from "@/lib/helper";

export type ReqInfo = {
  attachments: string | null;
  category: string | null;
  contractor: string | null;
  createdAt: Date;
  description: string;
  id: string;
  issue: string;
  maintenanceDate: Date | null;
  priority: "Low" | "Medium" | "High";
  propertyId: string;
  reqId: string;
  status: RequestStatus;
  summary: string;
  updatedAt: Date;
  user: {
    name: string;
    tenant: {
      unit: string;
    } | null;
  };
  userId: string;
};

type UpdatedReq = Omit<ReqInfo, "user">;

type FilterValue = {
  searchType: "id" | "property" | "issue"; // Assuming these are the only search types
  searchValue: string;
  status: string[]; // Array of selected status strings
  priority: string[]; // Array of selected priority strings
};

const statusOptions = ["New", "Progress", "Pending", "Closed"];
const priorityOptions = ["Low", "Medium", "High"];

export default function MaintenanceRequestsTable() {
  const user = useCurrentUser();

  const [viewDialog, setViewDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [propertyName, setPropertyName] = React.useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = React.useState<ReqInfo | null>(
    null
  );

  const handleCloseViewDialog = () => {
    setSelectedRequest(null);
    setViewDialog((prev) => !prev);
  };

  const [requests, setRequests] = React.useState<ReqInfo[]>([]);
  const [filteredRequests, setFilteredRequests] = React.useState<ReqInfo[]>([]);
  const [filters, setFilters] = React.useState({
    searchType: "id",
    searchValue: "",
    status: [] as string[],
    priority: [] as string[],
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 7;

  React.useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const subscribeToMaintenance = () => {
      pusherClient.subscribe("maintenance");

      pusherClient.bind("update", (data: UpdatedReq) => {
        setFilteredRequests((prev) => {
          return prev.map((p) => {
            if (p.id === data.id) {
              return {
                ...p,
                status: data.status,
                priority: data.priority,
                contractor: data.contractor,
                category: data.category,
              };
            } else {
              return p;
            }
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
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const getInfo = async () => {
      const data = await getRequestInfoForManager(user?.id as string);

      if (data && data.property) {
        setPropertyName(data.property.name as string);

        setRequests(data.reqInfo);
        setFilteredRequests(data.reqInfo);
      }

      setLoading(false);
    };

    getInfo();
  }, [user?.id]);

  const handleFilterChange = (
    key: string,
    value: FilterValue[keyof FilterValue]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const filtered = requests.filter((request) => {
      const searchValue = newFilters.searchValue.toLowerCase();
      const searchField = request[newFilters.searchType as keyof ReqInfo];

      // Check if searchField is defined and filter accordingly
      const matchesSearch =
        searchValue === "" ||
        (searchField !== null &&
          searchField.toString().toLowerCase().includes(searchValue));

      const matchesStatus =
        newFilters.status.length === 0 ||
        newFilters.status.includes(request.status);

      const matchesPriority =
        newFilters.priority.length === 0 ||
        newFilters.priority.includes(request.priority);

      return matchesSearch && matchesStatus && matchesPriority;
    });
    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const statusColors = {
    Progress: "bg-custom-1",
    Pending: "bg-[#374151]",
    Closed: "bg-custom-2",
    New: "bg-background",
  };

  const priorityColors = {
    Low: "bg-custom-11",
    Medium: "bg-custom-7",
    High: "bg-custom-8",
  };

  const ComboboxFilter = ({
    options,
    value,
    onChange,
    placeholder,
  }: {
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder: string;
  }) => {
    const [open, setOpen] = React.useState(false);

    const selectedValue = Array.isArray(value) ? value : [];

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {selectedValue && selectedValue.length > 0 ? (
              `${selectedValue.length} selected`
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" /> {placeholder}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      const newValue =
                        selectedValue && selectedValue.includes(option)
                          ? selectedValue.filter((item) => item !== option)
                          : [...selectedValue, option];
                      console.log(newValue);
                      onChange(newValue);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue && selectedValue.includes(option)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option === "Progress"
                      ? "In Progress"
                      : option.charAt(0).toUpperCase() + option.slice(1)}
                    <span className="ml-auto text-xs text-muted-foreground">
                      (
                      {
                        requests.filter(
                          (r) =>
                            r[placeholder.toLowerCase() as keyof ReqInfo] ===
                            option
                        ).length
                      }
                      )
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const pageCount = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex">
            <select
              className="px-3 py-2 bg-background border border-r-0 border-input rounded-l-md text-sm"
              value={filters.searchType}
              onChange={(e) =>
                setFilters({ ...filters, searchType: e.target.value })
              }
            >
              <option value="id">ID</option>
              <option value="property">Property</option>
              <option value="issue">Issue</option>
            </select>
            <Input
              className="rounded-l-none"
              placeholder={`Filter by ${filters.searchType}`}
              value={filters.searchValue}
              onChange={(e) =>
                handleFilterChange("searchValue", e.target.value)
              }
            />
          </div>
          <ComboboxFilter
            options={statusOptions}
            value={filters.status || []}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder="Status"
          />
          <ComboboxFilter
            options={priorityOptions}
            value={filters.priority || []}
            onChange={(value) => handleFilterChange("priority", value)}
            placeholder="Priority"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          {filteredRequests.length > 0 && (
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow key={request.id} className="*:py-5">
                  <TableCell>
                    {propertyName?.slice(0, 3).toUpperCase()}
                    {request.reqId.slice(0, 3).toUpperCase()}
                  </TableCell>
                  <TableCell>Unit {request.user.tenant?.unit}</TableCell>
                  <TableCell>{request.issue}</TableCell>
                  <TableCell>
                    <Badge
                      variant={request.status === "New" ? "outline" : "default"}
                      className={`${
                        statusColors[request.status]
                      } flex justify-center items-center rounded-xl py-1`}
                    >
                      {request.status === "Progress"
                        ? "In Progress"
                        : request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        priorityColors[request.priority]
                      } flex items-center justify-center rounded-xl py-1`}
                    >
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setViewDialog(true);
                      }}
                      className="border-2 border-custom-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {loading && (
          <div className="w-full mt-2 text-center text-gray-400">
            <BeatLoader color="#003366" />
          </div>
        )}
        {!loading && filteredRequests.length === 0 && (
          <div className="w-full mt-2 text-center text-gray-400">
            No item found.
          </div>
        )}
        {paginatedRequests.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{" "}
              {filteredRequests.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {pageCount}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                }
                disabled={currentPage === pageCount}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <RequestDialog
          viewDialog={viewDialog}
          setViewDialog={handleCloseViewDialog}
          request={selectedRequest}
          address={propertyName as string}
        />
      )}
    </>
  );
}
