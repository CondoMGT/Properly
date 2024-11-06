"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Trash,
  Edit,
  ChevronRight,
  ChevronLeft,
  X,
  ChevronDown,
  CalendarIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TenantFormValues, TenantSchema } from "@/schemas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  SkippedTenant,
  SkippedTenantsModal,
} from "@/components/tenant/skipped-tenants-modal";
import { getPropertyTenants } from "@/data/manager";
import { useCurrentUser } from "@/hooks/use-current-user";
import { BeatLoader } from "react-spinners";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

type Tenant = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  unit: string;
  startDate: Date;
  endDate: Date;
};

type DateFilter = {
  startMonths: string[];
  startYears: string[];
  endMonths: string[];
  endYears: string[];
};

type TenantFormProps = {
  onSubmit: (data: TenantFormValues) => void;
  initialData?: Partial<TenantFormValues>;
  handleBack?: () => void;
  newTenant: boolean;
};

type ImportResult = {
  importedTenants: Tenant[];
  skippedTenants: {
    name: string;
    email: string;
    reason: string;
  }[];
};

const AddTenantSchema = z.object({
  addMethod: z.enum(["regular", "oauth"]),
});

type AddTenantFormValues = z.infer<typeof AddTenantSchema>;

const OAuthEmailsSchema = z.object({
  emails: z.string().refine(
    (value) => {
      const emails = value
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e !== "");
      const uniqueEmails = new Set(emails);
      return (
        emails.length > 0 &&
        emails.every((email) => z.string().email().safeParse(email).success) &&
        emails.length === uniqueEmails.size
      );
    },
    {
      message:
        "Please enter valid email addresses, one per line, with no duplicates",
    }
  ),
});

type OAuthEmailsFormValues = z.infer<typeof OAuthEmailsSchema>;

export const TenantManagement = () => {
  const user = useCurrentUser();

  const [loading, setLoading] = useState(true);

  const [popoverOpen, setPopoverOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilters, setDateFilters] = useState<DateFilter>({
    startMonths: [],
    startYears: [],
    endMonths: [],
    endYears: [],
  });
  const [skippedTenants, setSkippedTenants] = useState<SkippedTenant[]>([]);

  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [addMethod, setAddMethod] = useState<"regular" | "oauth" | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTenants = async () => {
      const data = await getPropertyTenants(user?.id as string);

      if (data) {
        const formattedData = data?.map((d) => {
          return d.tenants.map((t) => ({
            id: t.id as string,
            name: t.user.name as string,
            email: t.user.email as string,
            unit: t.unit,
            phoneNumber: t.user.phoneNumber as string,
            startDate: t.startDate as Date,
            endDate: t.endDate as Date,
          }));
        });

        setTenants(formattedData.flat() as Tenant[]);
      }

      setLoading(false);
    };

    fetchTenants();
  }, [user?.id]);

  useEffect(() => {
    handleFilterChange();
  }, [tenants, nameFilter, dateFilters]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredTenants.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredTenants]);

  const handleFilterChange = () => {
    let filtered = tenants;
    if (nameFilter) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    filtered = filtered.filter((tenant) => {
      const startMonth = tenant.startDate.toLocaleString("default", {
        month: "long",
      });
      const startYear = tenant.startDate.getFullYear().toString();
      const endMonth = tenant.endDate.toLocaleString("default", {
        month: "long",
      });
      const endYear = tenant.endDate.getFullYear().toString();

      return (
        (dateFilters.startMonths.length === 0 ||
          dateFilters.startMonths.includes(startMonth)) &&
        (dateFilters.startYears.length === 0 ||
          dateFilters.startYears.includes(startYear)) &&
        (dateFilters.endMonths.length === 0 ||
          dateFilters.endMonths.includes(endMonth)) &&
        (dateFilters.endYears.length === 0 ||
          dateFilters.endYears.includes(endYear))
      );
    });
    setFilteredTenants(filtered);
  };

  const handleAddTenant = (newTenant: Tenant) => {
    setTenants([...tenants, newTenant]);
    setShowAddTenantModal(false);
    setAddMethod(null);
    toast.success("Tenant Added", {
      description: `${newTenant.name} has been added to the list.`,
    });
  };

  const handleAddTenantClick = () => {
    setShowAddTenantModal(true);
  };

  const handleAddMethodSubmit = (values: AddTenantFormValues) => {
    setAddMethod(values.addMethod);
  };

  const handleOAuthEmailsSubmit = (values: OAuthEmailsFormValues) => {
    const emailList = Array.from(
      new Set(
        values.emails
          .split("\n")
          .map((e) => e.trim())
          .filter((e) => e !== "")
      )
    );
    // Handle OAuth emails submission
    console.log("OAuth emails:", emailList);
    // You would typically send these emails to your backend to handle OAuth invitations
    toast.success("OAuth invitations sent", {
      description: `Invitations sent to ${emailList.length} email(s).`,
    });
    setShowAddTenantModal(false);
    setAddMethod(null);
  };

  const handleBackClick = () => {
    setAddMethod(null);
  };

  const handleEditTenant = (editedTenant: Tenant) => {
    setTenants(
      tenants.map((t) => (t.id === editedTenant.id ? editedTenant : t))
    );
    toast.success("Tenant Updated", {
      description: `${editedTenant.name}'s information has been updated.`,
    });
  };

  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter((t) => t.id !== id));
    toast.success("Tenant Deleted", {
      description: "The tenant has been removed from the list.",
    });
  };

  const handleExport = () => {
    if (filteredTenants.length === 0) {
      toast.error("Export Failed", {
        description: "No data available for export.",
      });
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "Name",
          "Email",
          "Phone Number",
          "Unit",
          "Start Date",
          "End Date",
        ].join(","),
        ...filteredTenants.map((t) =>
          [
            t.name,
            t.email,
            t.phoneNumber,
            t.unit,
            t.startDate.toISOString(),
            t.endDate.toISOString(),
          ].join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tenants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export Successful", {
      description: "The tenant data has been exported to a csv file.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    // Check the file type
    const validFileTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!validFileTypes.includes(`.${fileExtension}`)) {
      toast.error(
        "Invalid file type. Please upload a .csv, .xlsx, or .xls file."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      // Check if the content is empty
      if (!content) {
        toast.error("The file is empty or could not be read.");
        return;
      }

      const lines = content.split("\n");

      // Validate the expected format
      if (lines.length < 2) {
        toast.error("The file does not contain enough data.");
        return;
      }

      const importResult: ImportResult = {
        importedTenants: [],
        skippedTenants: [],
      };

      const existingEmails = new Set(
        tenants.map((tenant) => tenant.email.toLowerCase())
      );

      lines.slice(1).forEach((line, index) => {
        const [name, email, phoneNumber, unit, startDate, endDate] = line
          .split(",")
          .map((field) => field.trim());

        // Validate each field
        if (
          !name ||
          !email ||
          !phoneNumber ||
          !unit ||
          !startDate ||
          !endDate
        ) {
          importResult.skippedTenants.push({
            name: name || `Row ${index + 2}`,
            email: email || "N/A",
            reason: "Missing required fields",
          });
          return; // Skip this tenant
        }

        // Check for duplicate email
        if (existingEmails.has(email.toLowerCase())) {
          importResult.skippedTenants.push({
            name,
            email,
            reason: "Duplicate email",
          });
          return; // Skip this tenant
        }

        // Validate date formats
        const parsedStartDate = parse(startDate, "yyyy-MM-dd", new Date());
        const parsedEndDate = parse(endDate, "yyyy-MM-dd", new Date());

        if (
          isNaN(parsedStartDate.getTime()) ||
          isNaN(parsedEndDate.getTime())
        ) {
          importResult.skippedTenants.push({
            name,
            email,
            reason: "Invalid date format",
          });
          return; // Skip this tenant
        }

        existingEmails.add(email.toLowerCase());

        importResult.importedTenants.push({
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          phoneNumber,
          unit,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
        });
      });

      setTenants([...tenants, ...importResult.importedTenants]);
      setSkippedTenants(importResult.skippedTenants);

      // Provide feedback on the import results
      if (importResult.importedTenants.length > 0) {
        toast.success("Tenants Imported", {
          description: `${importResult.importedTenants.length} tenants have been imported successfully.`,
        });
      }

      if (importResult.skippedTenants.length > 0) {
        toast.warning("Some tenants were skipped", {
          description: `${importResult.skippedTenants.length} tenants were not imported due to errors.`,
        });
      }
    };

    reader.onerror = () => {
      toast.error("An error occurred while reading the file.");
    };

    reader.readAsText(file);
  };

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const dateOptions = useMemo(() => {
    const options = {
      startMonths: new Set<string>(),
      startYears: new Set<string>(),
      endMonths: new Set<string>(),
      endYears: new Set<string>(),
    };

    tenants.forEach((tenant) => {
      options.startMonths.add(
        tenant.startDate.toLocaleString("default", { month: "long" })
      );
      options.startYears.add(tenant.startDate.getFullYear().toString());
      options.endMonths.add(
        tenant.endDate.toLocaleString("default", { month: "long" })
      );
      options.endYears.add(tenant.endDate.getFullYear().toString());
    });

    // Convert Sets to Arrays
    const startMonthsArray = Array.from(options.startMonths);
    const startYearsArray = Array.from(options.startYears);
    const endMonthsArray = Array.from(options.endMonths);
    const endYearsArray = Array.from(options.endYears);

    // Sort months from January to December
    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const sortedStartMonths = startMonthsArray.sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );
    const sortedEndMonths = endMonthsArray.sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    // Sort years from oldest to newest
    const sortedStartYears = startYearsArray.sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
    const sortedEndYears = endYearsArray.sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    return {
      startMonths: sortedStartMonths,
      startYears: sortedStartYears,
      endMonths: sortedEndMonths,
      endYears: sortedEndYears,
    };
  }, [tenants]);

  const handlePopoverOpenChange = (id: string, isOpen: boolean) => {
    setPopoverOpen((prev) => ({ ...prev, [id]: isOpen }));
  };

  const closePopover = (id: string) => {
    setPopoverOpen((prev) => ({ ...prev, [id]: false }));
  };

  const handleEditClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setEditDialogOpen(true);
    closePopover(tenant.id);
  };

  const handleDeleteClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDeleteDialogOpen(true);
    closePopover(tenant.id);
  };

  // const handleEditSubmit = (editedTenant: Tenant) => {
  //   handleEditTenant(editedTenant);
  //   setEditDialogOpen(false);
  //   setSelectedTenant(null);
  // };

  const handleDeleteConfirm = () => {
    if (selectedTenant) {
      handleDeleteTenant(selectedTenant.id);
      setDeleteDialogOpen(false);
      setSelectedTenant(null);
    }
  };

  return (
    <div className="container mx-auto pt-10 pb-5">
      <div className="flex flex-col space-y-2 md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            className="bg-custom-1 hover:bg-custom-1"
            onClick={handleAddTenantClick}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Tenant
          </Button>

          <Button
            className="bg-custom-2 hover:bg-custom-2"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-custom-0 hover:bg-custom-0" asChild>
            <label>
              <Upload className="mr-2 h-4 w-4" /> Import
              <input
                type="file"
                onChange={handleImport}
                className="hidden"
                accept=".csv"
              />
            </label>
          </Button>
          {skippedTenants.length > 0 && (
            <SkippedTenantsModal skippedTenants={skippedTenants} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-0 md:gap-2 mb-4">
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          className="w-full col-span-1"
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <div className="col-span-2 w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <CommandCombobox
            options={dateOptions.startMonths}
            placeholder="Start Month"
            selected={dateFilters.startMonths}
            onSelectionChange={(selected) =>
              setDateFilters({ ...dateFilters, startMonths: selected })
            }
            getOptionCount={(option) =>
              filteredTenants.filter(
                (c) =>
                  c.startDate.toLocaleString("default", { month: "long" }) ===
                  option
              ).length
            }
          />
          <CommandCombobox
            options={dateOptions.startYears}
            placeholder="Start Year"
            selected={dateFilters.startYears}
            onSelectionChange={(selected) =>
              setDateFilters({ ...dateFilters, startYears: selected })
            }
            getOptionCount={(option) =>
              filteredTenants.filter(
                (c) => c.startDate.getFullYear().toString() === option
              ).length
            }
          />
          <CommandCombobox
            options={dateOptions.endMonths}
            placeholder="End Month"
            selected={dateFilters.endMonths}
            onSelectionChange={(selected) =>
              setDateFilters({ ...dateFilters, endMonths: selected })
            }
            getOptionCount={(option) =>
              filteredTenants.filter(
                (c) =>
                  c.endDate.toLocaleString("default", { month: "long" }) ===
                  option
              ).length
            }
          />
          <CommandCombobox
            options={dateOptions.endYears}
            placeholder="End Year"
            selected={dateFilters.endYears}
            onSelectionChange={(selected) =>
              setDateFilters({ ...dateFilters, endYears: selected })
            }
            getOptionCount={(option) =>
              filteredTenants.filter(
                (c) => c.endDate.getFullYear().toString() === option
              ).length
            }
          />
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex w-full justify-center items-center">
                    <BeatLoader color="#003366" />
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedTenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No tenants available
                </TableCell>
              </TableRow>
            ) : (
              paginatedTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.phoneNumber}</TableCell>
                  <TableCell>{tenant.unit}</TableCell>
                  <TableCell>{tenant.startDate.toLocaleDateString()}</TableCell>
                  <TableCell>{tenant.endDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Popover
                      open={popoverOpen[tenant.id]}
                      onOpenChange={(isOpen) =>
                        handlePopoverOpenChange(tenant.id, isOpen)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        <div className="grid gap-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleEditClick(tenant)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleDeleteClick(tenant)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {paginatedTenants.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {paginatedTenants.length} of {filteredTenants.length}{" "}
            tenants
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showAddTenantModal} onOpenChange={setShowAddTenantModal}>
        <DialogContent className="sm:max-w-[425px] bg-custom-4">
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>
              {addMethod === null
                ? "Choose how you want to add a new tenant."
                : addMethod === "regular"
                ? "Add New Tenant information below"
                : "Add all new tenants emails"}
            </DialogDescription>
          </DialogHeader>
          {addMethod === null ? (
            <AddTenantForm onSubmit={handleAddMethodSubmit} />
          ) : addMethod === "regular" ? (
            <TenantForm
              onSubmit={(data) => {
                const newTenant: Tenant = {
                  ...data,
                  id: Math.random().toString(36).substr(2, 9),
                };
                handleAddTenant(newTenant);
                setShowAddTenantModal(false);
                setAddMethod(null);
              }}
              handleBack={handleBackClick}
              newTenant
            />
          ) : (
            <OAuthEmailsForm
              onSubmit={handleOAuthEmailsSubmit}
              handleBack={handleBackClick}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Edit tenant details and Save changes.
            </DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <TenantForm
              onSubmit={(data) => {
                const editedTenant: Tenant = {
                  ...data,
                  id: selectedTenant.id,
                };
                handleEditTenant(editedTenant);
              }}
              initialData={selectedTenant}
              newTenant={false}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-extrabold text-black">
                {selectedTenant?.name}{" "}
              </span>
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-custom-8 hover:bg-custom-8"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function CommandCombobox({
  options,
  placeholder,
  selected,
  onSelectionChange,
  getOptionCount,
}: {
  options: string[];
  placeholder: string;
  selected: string[];
  onSelectionChange: (value: string[]) => void;
  getOptionCount: (option: string) => number;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      onSelectionChange(selected.filter((item) => item !== option));
    } else {
      onSelectionChange([...selected, option]);
    }
  };

  const handleDeselect = (option: string) => {
    onSelectionChange(selected.filter((item) => item !== option));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.length >= 3 ? (
                <Badge variant="secondary" className="mr-1">
                  {selected.length} selected
                </Badge>
              ) : (
                selected.map((item) => (
                  <Badge key={item} variant="secondary" className="mr-1">
                    {item}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleDeselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleDeselect(item)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option} onSelect={() => handleSelect(option)}>
                  <Checkbox
                    checked={selected.includes(option)}
                    className="mr-2"
                  />
                  {option}
                  <span className="ml-auto text-xs text-muted-foreground">
                    ({getOptionCount(option)})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TenantForm({
  onSubmit,
  initialData,
  handleBack,
  newTenant,
}: TenantFormProps) {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      unit: initialData?.unit || "",
      startDate: initialData?.startDate || undefined,
      endDate: initialData?.endDate || undefined,
    },
  });

  function handleSubmit(values: TenantFormValues) {
    onSubmit(values);
  }

  return (
    <ScrollArea className="h-[400px] md:h-[600px] px-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 px-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="A101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() ||
                        (form.getValues("endDate")
                          ? date > form.getValues("endDate")
                          : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date when the tenant&apos;s lease begins
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <= new Date() ||
                        (form.getValues("startDate")
                          ? date <= form.getValues("startDate")
                          : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date when the tenant&apos;s lease ends
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className={`flex items-center ${
              newTenant ? "justify-between" : "justify-end"
            }`}
          >
            {newTenant && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="pl-0"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <Button type="submit" className="bg-custom-1 hover:bg-custom-1">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}

function AddTenantForm({
  onSubmit,
}: {
  onSubmit: (data: AddTenantFormValues) => void;
}) {
  const form = useForm<AddTenantFormValues>({
    resolver: zodResolver(AddTenantSchema),
    defaultValues: {
      addMethod: "regular",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="addMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="regular" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Add tenant manually
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="oauth" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Add tenant(s) via OAuth
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-custom-1 hover:bg-custom-1">
          Next
        </Button>
      </form>
    </Form>
  );
}

function OAuthEmailsForm({
  onSubmit,
  handleBack,
}: {
  onSubmit: (data: OAuthEmailsFormValues) => void;
  handleBack: () => void;
}) {
  const form = useForm<OAuthEmailsFormValues>({
    resolver: zodResolver(OAuthEmailsSchema),
    defaultValues: {
      emails: "",
    },
  });

  const [isTextAreaEmpty, setIsTextAreaEmpty] = useState(true);
  const [highlightedEmails, setHighlightedEmails] = useState<string>("");
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.emails !== undefined) {
        setIsTextAreaEmpty(value.emails.trim() === "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const validateAndHighlightEmails = (value: string) => {
    const emails = value.split("\n");
    const highlightedLines = emails.map((email) => {
      const trimmedEmail = email.trim();
      if (trimmedEmail === "") return email;
      return z.string().email().safeParse(trimmedEmail).success
        ? email
        : `<span style="color: red;">${email}</span>`;
    });

    setHighlightedEmails(highlightedLines.join("\n"));
  };

  const handleSubmit = (values: OAuthEmailsFormValues) => {
    const isValid = OAuthEmailsSchema.safeParse(values).success;

    if (isValid) {
      onSubmit(values);
      setShowHighlight(false);
    } else {
      validateAndHighlightEmails(values.emails);
      setShowHighlight(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="fonr-semibold">Email Addresses</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Enter email addresses, one per line"
                    className="h-[200px] resize-none font-mono"
                    {...field}
                  />
                  {showHighlight && (
                    <div
                      className="absolute inset-0 pointer-events-none font-mono whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: highlightedEmails }}
                      style={{
                        padding: "0.5rem 0.75rem", // Match Textarea padding
                        lineHeight: "1.5", // Match Textarea line height
                        fontFamily: "inherit", // Use the same font as the Textarea
                        fontSize: "inherit", // Use the same font size as the Textarea
                      }}
                    />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Enter one email address per line. Invalid emails and duplicates
                will be highlighted in red.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            className="pl-0"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            type="submit"
            className="bg-custom-1 hover:bg-custom-1"
            disabled={isTextAreaEmpty}
          >
            Send OAuth Invitations
          </Button>
        </div>
      </form>
    </Form>
  );
}
