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
import { Eye, Check } from "lucide-react";
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
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Request = {
  id: string;
  property: string;
  issue: string;
  status: "in progress" | "pending" | "closed" | "new";
  priority: "low" | "medium" | "high";
};

const requests: Request[] = [
  {
    id: "REQ001",
    property: "Apt 101",
    issue: "Leaky faucet",
    status: "new",
    priority: "low",
  },
  {
    id: "REQ002",
    property: "Apt 202",
    issue: "Broken AC",
    status: "in progress",
    priority: "high",
  },
  {
    id: "REQ003",
    property: "Apt 305",
    issue: "Pest control",
    status: "pending",
    priority: "medium",
  },
  {
    id: "REQ004",
    property: "Apt 404",
    issue: "Paint touch-up",
    status: "closed",
    priority: "low",
  },
  {
    id: "REQ005",
    property: "Apt 501",
    issue: "Clogged drain",
    status: "new",
    priority: "medium",
  },
];

const statusOptions = ["new", "in progress", "pending", "closed"];
const priorityOptions = ["low", "medium", "high"];

export default function MaintenanceRequestsTable() {
  const [filteredRequests, setFilteredRequests] = React.useState(requests);
  const [filters, setFilters] = React.useState({
    searchType: "id",
    searchValue: "",
    status: [] as string[],
    priority: [] as string[],
  });

  const handleFilterChange = (key: string, value: any) => {
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
  };

  const statusColors = {
    "in progress": "bg-custom-1",
    pending: "bg-[#374151]",
    closed: "bg-custom-2",
    new: "bg-background",
  };

  const priorityColors = {
    low: "bg-custom-11",
    medium: "bg-custom-7",
    high: "bg-custom-8",
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

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {value.length > 0 ? `${value.length} selected` : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    onChange(
                      value.includes(option)
                        ? value.filter((item) => item !== option)
                        : [...value, option]
                    );
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option) ? "opacity-100" : "opacity-0"
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
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
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
            onChange={(e) => handleFilterChange("searchValue", e.target.value)}
          />
        </div>
        <ComboboxFilter
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          placeholder="Status"
        />
        <ComboboxFilter
          options={priorityOptions}
          value={filters.priority}
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
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.property}</TableCell>
                <TableCell>{request.issue}</TableCell>
                <TableCell>
                  <Badge
                    variant={request.status === "new" ? "outline" : "default"}
                    className={`${
                      statusColors[request.status]
                    } flex justify-center items-center rounded-xl`}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      priorityColors[request.priority]
                    } flex items-center justify-center rounded-xl`}
                  >
                    {request.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log(`View request ${request.id}`)}
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
    </div>
  );
}
