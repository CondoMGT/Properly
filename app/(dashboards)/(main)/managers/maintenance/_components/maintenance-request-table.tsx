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

export type Request = {
  id: string;
  property: string;
  issue: string;
  status: "In Progress" | "Pending" | "Closed" | "New";
  priority: "Low" | "Medium" | "High";
};

const requests: Request[] = [
  {
    id: "REQ001",
    property: "Apt 101",
    issue: "Leaky faucet",
    status: "New",
    priority: "Low",
  },
  {
    id: "REQ002",
    property: "Apt 202",
    issue: "Broken AC",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "REQ003",
    property: "Apt 305",
    issue: "Pest control",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "REQ004",
    property: "Apt 404",
    issue: "Paint touch-up",
    status: "Closed",
    priority: "Low",
  },
  {
    id: "REQ005",
    property: "Apt 501",
    issue: "Clogged drain",
    status: "New",
    priority: "Medium",
  },
];

type FilterValue = {
  searchType: "id" | "property" | "issue"; // Assuming these are the only search types
  searchValue: string;
  status: string[]; // Array of selected status strings
  priority: string[]; // Array of selected priority strings
};

const statusOptions = ["New", "In Progress", "Pending", "Closed"];
const priorityOptions = ["Low", "Medium", "High"];

export default function MaintenanceRequestsTable() {
  const user = useCurrentUser();

  const [viewDialog, setViewDialog] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<Request | null>(
    null
  );

  const handleCloseViewDialog = () => {
    setSelectedRequest(null);
    setViewDialog(false);
  };

  const [filteredRequests, setFilteredRequests] = React.useState(requests);
  const [filters, setFilters] = React.useState({
    searchType: "id",
    searchValue: "",
    status: [] as string[],
    priority: [] as string[],
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 7;

  React.useEffect(() => {
    const getInfo = async () => {
      console.log(await getRequestInfoForManager(user?.id as string));
    };

    getInfo();
  }, [user?.id]);

  const handleFilterChange = (
    key: string,
    value: FilterValue[keyof FilterValue]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const filtered = requests.filter(
      (request) =>
        (newFilters.searchValue === "" ||
          request[newFilters.searchType as keyof Request]
            .toString()
            .toLowerCase()
            .includes(newFilters.searchValue.toLowerCase())) &&
        (newFilters.status.length === 0 ||
          newFilters.status.includes(request.status)) &&
        (newFilters.priority.length === 0 ||
          newFilters.priority.includes(request.priority))
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const statusColors = {
    "In Progress": "bg-custom-1",
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
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                    <span className="ml-auto text-xs text-muted-foreground">
                      (
                      {
                        requests.filter(
                          (r) =>
                            r[placeholder.toLowerCase() as keyof Request] ===
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
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.property}</TableCell>
                  <TableCell>{request.issue}</TableCell>
                  <TableCell>
                    <Badge
                      variant={request.status === "New" ? "outline" : "default"}
                      className={`${
                        statusColors[request.status]
                      } flex justify-center items-center rounded-xl py-1`}
                    >
                      {request.status}
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
                        console.log(`View request ${request.id}`);
                        setSelectedRequest(request);
                        setViewDialog(true);
                      }}
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
        {filteredRequests.length === 0 && (
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
        />
      )}
    </>
  );
}
