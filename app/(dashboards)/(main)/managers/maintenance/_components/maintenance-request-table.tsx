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
  ChevronUp,
  ArrowUpDown,
  ChevronDown,
  X,
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
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { RequestDialog } from "./request-dialog";
import { RequestStatus } from "@prisma/client";
import { BeatLoader } from "react-spinners";
import { pusherClient } from "@/lib/pusher";
import { handleNotification } from "@/lib/helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ReqInfo = {
  attachments: string | null;
  category: string | null;
  contractor: string | null;
  createdAt: Date;
  description: string;
  id: string;
  issue: string;
  maintenanceDate: Date | null;
  maintenanceCompletedDate: Date | null;
  scheduledDate: Date | null;
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

type MaintenanceTableProps = {
  requests: ReqInfo[];
  propertyName: string | null;
};

type FilterValue = {
  searchType: "id" | "user" | "issue"; // Assuming these are the only search types
  searchValue: string;
  status: string[]; // Array of selected status strings
  priority: string[]; // Array of selected priority strings
};

const statusOptions = ["New", "Progress", "Pending", "Closed"];
const priorityOptions = ["Low", "Medium", "High"];

type SortConfig = {
  key: keyof ReqInfo | null;
  direction: "asc" | "desc" | null;
};

export const MaintenanceRequestsTable = ({
  requests,
  propertyName,
}: MaintenanceTableProps) => {
  const [loading, setLoading] = React.useState(false);
  const [viewDialog, setViewDialog] = React.useState(false);

  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: null,
  });

  const [selectedRequest, setSelectedRequest] = React.useState<ReqInfo | null>(
    null
  );
  const [updated, setUpdated] = React.useState<string[]>([]);

  const handleCloseViewDialog = () => {
    setSelectedRequest(null);
    setViewDialog((prev) => !prev);
  };

  const [filteredRequests, setFilteredRequests] = React.useState<ReqInfo[]>([]);
  const [filters, setFilters] = React.useState({
    searchType: "id",
    searchValue: "",
    status: [] as string[],
    priority: [] as string[],
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 7;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  React.useEffect(() => {
    if (
      !isMobile &&
      ("Notification" in window || navigator.serviceWorker) &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const getInfo = async () => {
      if (requests) {
        setFilteredRequests(requests);
      }

      setLoading(false);
    };

    getInfo();

    const subscribeToMaintenance = () => {
      pusherClient.subscribe("maintenance");

      pusherClient.bind(
        "update",
        ({ data, action }: { data: ReqInfo; action: string }) => {
          setUpdated((prev) => [...prev, data.id]);
          setFilteredRequests((prev) => {
            let updatedRequests: ReqInfo[];

            if (action === "New Request") {
              // Check if the request already exists
              const exists = prev.some((req) => req.id === data.id);
              if (!exists) {
                updatedRequests = [data, ...prev];
              } else {
                updatedRequests = prev;
              }
            } else {
              updatedRequests = prev.map((req) =>
                req.id === data.id ? { ...req, ...data } : req
              );
            }

            return updatedRequests;
          });

          handleNotification({
            title:
              action === "New Request"
                ? "New Maintenance Request"
                : "Updated Maintenance Request",
            body:
              action === "New Request"
                ? "A new maintenance request has been added"
                : "A maintenance request has been updated",
            icon: "/logo.svg",
          });
        }
      );
    };

    subscribeToMaintenance();

    return () => {
      pusherClient.unsubscribe("maintenance");
    };
  }, [requests]);

  const handleFilterChange = (
    key: string,
    value: FilterValue[keyof FilterValue]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const filtered = requests.filter((request) => {
      const searchValue = newFilters.searchValue.toLowerCase();

      const searchField =
        newFilters.searchType === "user"
          ? request[newFilters.searchType]?.tenant?.unit ?? ""
          : request[newFilters.searchType as keyof ReqInfo];

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

  const handleSort = (key: keyof ReqInfo) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const statusColors = {
    Progress: "bg-custom-1",
    Pending: "bg-[#374151]",
    Closed: "bg-custom-2",
    New: "bg-custom-7",
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

    const handleClearAll = () => {
      onChange([]);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {selectedValue && selectedValue.length > 0 ? (
              <>
                {`${selectedValue.length} selected`}
                <X
                  className="ml-2 h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearAll();
                  }}
                />
              </>
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
              {selectedValue.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleClearAll}
                      className="justify-center text-center"
                    >
                      Clear All
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const sortedRequests = React.useMemo(() => {
    const sortableRequests = [...filteredRequests];
    if (sortConfig.key !== null && sortConfig.direction !== null) {
      sortableRequests.sort((a, b) => {
        if (sortConfig.key === null) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRequests;
  }, [filteredRequests, sortConfig]);

  const pageCount = Math.ceil(sortedRequests.length / itemsPerPage);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ column }: { column: keyof ReqInfo }) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-nunito font-semibold">
              Maintenance Requests
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => handleSort("createdAt")}
              className="justify-start bg-custom-11 hover:bg-custom-11 text-secondary hover:text-secondary"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort by Date
              {sortConfig.key === "createdAt" && (
                <span className="ml-1">
                  ({sortConfig.direction === "asc" ? "Oldest" : "Newest"})
                </span>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center">
              <BeatLoader color="#003366" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className=" w-full flex">
                  <select
                    className="px-3 py-2 h-9 bg-background rounded-l-md border border-r-0 text-sm"
                    value={filters.searchType}
                    onChange={(e) =>
                      setFilters({ ...filters, searchType: e.target.value })
                    }
                  >
                    <option value="id">ID</option>
                    <option value="user">Property</option>
                    <option value="issue">Issue</option>
                  </select>
                  <Input
                    className="rounded-l-none focus-visible:ring-0"
                    placeholder={`Filter by ${
                      filters.searchType === "user"
                        ? "property"
                        : filters.searchType
                    }`}
                    value={filters.searchValue}
                    onChange={(e) =>
                      handleFilterChange("searchValue", e.target.value)
                    }
                  />
                </div>
                <div className="w-full space-x-2 flex justify-end">
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
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="hidden md:inline">Request</span> ID
                    </TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="font-semibold"
                      >
                        Status <SortIcon column="status" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("priority")}
                        className="font-semibold"
                      >
                        Priority <SortIcon column="priority" />
                      </Button>
                    </TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                {sortedRequests.length > 0 && (
                  <TableBody>
                    {paginatedRequests.map((request) => (
                      <TableRow key={request.id} className={`*:py-5`}>
                        <TableCell
                          className={`${
                            updated.includes(request.id) &&
                            "font-extrabold underline relative"
                          }`}
                        >
                          {updated.includes(request.id) && (
                            <div className="h-6 w-1 bg-red-500 absolute left-0" />
                          )}
                          {propertyName?.slice(0, 3).toUpperCase()}
                          {request.id.slice(0, 3).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          Unit {request?.user?.tenant?.unit}
                        </TableCell>
                        <TableCell className="truncate">
                          {request.issue}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "New" ? "outline" : "default"
                            }
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
                              setUpdated((prev) =>
                                prev.filter((p) => p !== request.id)
                              );
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
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredRequests.length
                    )}{" "}
                    of {filteredRequests.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
          )}
        </CardContent>
      </Card>

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
};
