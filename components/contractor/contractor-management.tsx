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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialogTrigger,
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
import * as z from "zod";
import { toast } from "sonner";
import { ContractorSchema } from "@/schemas";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { addContractor } from "@/actions/contractor";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getPropertyId } from "@/data/manager";
import {
  SkippedTenant,
  SkippedTenantsModal,
} from "../tenant/skipped-tenants-modal";
import { fetchContractors } from "@/data/contractor";
import { BeatLoader } from "react-spinners";

export type Contractor = {
  id: string;
  name: string;
  specialty: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  yearsOfExperience: number;
  serviceArea: string;
  availability: string[];
  startHour: number;
  endHour: number;
  emergency: boolean;
  rating: number;
  insurance: boolean;
  ratePerHour: number;
  addedAt?: Date;
  updatedAt?: Date;
};

type ImportResult = {
  importedContractors: Contractor[];
  skippedContractors: {
    name: string;
    email: string;
    reason: string;
  }[];
};

const specialties = [
  "Flooring",
  "Cleaning",
  "Painting",
  "Carpentry",
  "Pest Control",
  "Security Systems",
  "Appliance Repair",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Landscaping",
  "General Maintenance",
];
const serviceAreas = [
  "City 1",
  "City 2",
  "City 3",
  "City 4",
  "City 5",
  "City 6",
  "City 7",
  "City 8",
  "City 9",
  "City 10",
];

export const ContractorManagement = () => {
  const user = useCurrentUser();

  const [loading, setLoading] = useState(false);

  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>(
    []
  );
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [skippedContractors, setSkippedContractors] = useState<SkippedTenant[]>(
    []
  );

  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string[]>([]);
  const [serviceAreaFilter, setServiceAreaFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string[]>([]);
  const [emergencyFilter, setEmergencyFilter] = useState<string[]>([]);
  const [insuranceFilter, setInsuranceFilter] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPropertyInfo = async () => {
      const info = await getPropertyId(user?.id as string);

      if (info) {
        setPropertyId(info);
      }
    };

    fetchPropertyInfo();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchPropertyContractors = async () => {
      const contractors = await fetchContractors(propertyId as string);

      if (contractors) {
        setContractors(contractors);
      }

      setLoading(false);
    };

    fetchPropertyContractors();
  }, [propertyId]);

  useEffect(() => {
    handleFilterChange();
  }, [
    contractors,
    nameFilter,
    specialtyFilter,
    serviceAreaFilter,
    ratingFilter,
    emergencyFilter,
    insuranceFilter,
  ]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredContractors.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredContractors]);

  const handleFilterChange = () => {
    let filtered = contractors;
    if (nameFilter) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (specialtyFilter.length > 0) {
      filtered = filtered.filter((c) => specialtyFilter.includes(c.specialty));
    }
    if (serviceAreaFilter.length > 0) {
      filtered = filtered.filter((c) =>
        serviceAreaFilter.includes(c.serviceArea)
      );
    }
    if (ratingFilter.length > 0) {
      filtered = filtered.filter((c) =>
        ratingFilter.some((r) => c.rating >= parseInt(r))
      );
    }
    if (emergencyFilter.length > 0) {
      filtered = filtered.filter((c) =>
        emergencyFilter.includes(c.emergency ? "Yes" : "No")
      );
    }
    if (insuranceFilter.length > 0) {
      filtered = filtered.filter((c) =>
        insuranceFilter.includes(c.insurance ? "Yes" : "No")
      );
    }
    setFilteredContractors(filtered);
  };

  const handleAddContractor = (newContractor: Contractor) => {
    setContractors([...contractors, newContractor]);
    toast.success("Contractor Added", {
      description: `${newContractor.name} has been added to the list.`,
    });
  };

  const handleEditContractor = (editedContractor: Contractor) => {
    setContractors(
      contractors.map((c) =>
        c.id === editedContractor.id ? editedContractor : c
      )
    );
    toast.success("Contractor Updated", {
      description: `${editedContractor.name}'s information has been updated.`,
    });
  };

  const handleDeleteContractor = (id: string) => {
    setContractors(contractors.filter((c) => c.id !== id));
    toast.success("Contractor Deleted", {
      description: "The contractor has been removed from the list.",
    });
  };

  const handleExport = () => {
    if (filteredContractors.length === 0) {
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
          "Specialty",
          "Phone Number",
          "Email",
          "License Number",
          "Years of Experience",
          "Service Area",
          "Availability",
          "Start Hour",
          "End Hour",
          "Emergency",
          "Rating",
          "Insurance",
          "Rate per Hour",
        ].join(","),
        ...filteredContractors.map((c) =>
          [
            c.name,
            c.specialty,
            c.phoneNumber,
            c.email,
            c.licenseNumber,
            c.yearsOfExperience,
            c.serviceArea,
            c.availability.join(";"),
            c.startHour,
            c.endHour,
            c.emergency,
            c.rating,
            c.insurance,
            c.ratePerHour,
          ].join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contractors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export Successful", {
      description: "The contractor data has been exported to a csv file.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    if (file) {
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
          importedContractors: [],
          skippedContractors: [],
        };

        const existingEmails = new Set(
          contractors.map((contractor) => contractor.email.toLowerCase())
        );

        lines.slice(1).forEach(async (line) => {
          const [
            name,
            specialty,
            companyName,
            phoneNumber,
            email,
            licenseNumber,
            yearsOfExperience,
            serviceArea,
            availability,
            startHour,
            endHour,
            emergency,
            rating,
            insurance,
            ratePerHour,
          ] = line.split(",");

          // Validate each field as needed (this is a basic example)
          if (!name || !email || !phoneNumber) {
            toast.error("Missing required fields in the file.");
            throw new Error("Validation error");
          }

          // Check for duplicate email
          if (existingEmails.has(email.toLowerCase())) {
            importResult.skippedContractors.push({
              name,
              email,
              reason: "Duplicate email found",
            });
            return; // Skip adding this contractor
          }

          existingEmails.add(email.toLowerCase());

          importResult.importedContractors.push({
            id: Math.random().toString(36).substr(2, 9),
            name,
            specialty,
            companyName,
            phoneNumber,
            email,
            licenseNumber,
            yearsOfExperience: parseInt(yearsOfExperience),
            serviceArea,
            availability: availability.split(";"),
            startHour: parseInt(startHour),
            endHour: parseInt(endHour),
            emergency: emergency === "true",
            rating: parseFloat(rating),
            insurance: insurance === "true",
            ratePerHour: parseInt(ratePerHour),
          });

          await addContractor(
            {
              id: Math.random().toString(36).substr(2, 9),
              name,
              specialty,
              companyName,
              phoneNumber,
              email,
              licenseNumber,
              yearsOfExperience: parseInt(yearsOfExperience),
              serviceArea,
              availability: availability.split(";"),
              startHour: parseInt(startHour),
              endHour: parseInt(endHour),
              emergency: emergency === "true",
              rating: parseFloat(rating),
              insurance: insurance === "true",
              ratePerHour: parseInt(ratePerHour),
            },
            propertyId as string
          );
        });

        setContractors([...contractors, ...importResult.importedContractors]);
        setSkippedContractors(importResult.skippedContractors);
        toast.success("Contractors Imported", {
          description: `${importResult.importedContractors.length} contractors have been imported.`,
        });
      };

      reader.onerror = () => {
        toast.error("An error occurred while reading the file.");
      };

      reader.readAsText(file);
    }
  };

  const paginatedContractors = filteredContractors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const availableSpecialties = useMemo(() => {
    return Array.from(new Set(filteredContractors.map((c) => c.specialty)));
  }, [filteredContractors]);

  const availableServiceAreas = useMemo(() => {
    return Array.from(new Set(filteredContractors.map((c) => c.serviceArea)));
  }, [filteredContractors]);

  const availableRatings = useMemo(() => {
    return Array.from(
      new Set(filteredContractors.map((c) => Math.floor(c.rating).toString()))
    );
  }, [filteredContractors]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-2 md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contractor Management</h1>
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-custom-1 hover:bg-custom-1">
                <Plus className="mr-2 h-4 w-4" /> Add Contractor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-custom-4">
              <DialogHeader>
                <DialogTitle>Add New Contractor</DialogTitle>
              </DialogHeader>
              <ContractorForm onSubmit={handleAddContractor} />
            </DialogContent>
          </Dialog>
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
                accept=".csv,.xlsx,.xls"
              />
            </label>
          </Button>
          {skippedContractors.length > 0 && (
            <SkippedTenantsModal
              skippedTenants={skippedContractors}
              type="Contractors"
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <CommandCombobox
          options={availableSpecialties}
          placeholder="Specialty"
          selected={specialtyFilter}
          onSelectionChange={setSpecialtyFilter}
          getOptionCount={(option) =>
            filteredContractors.filter((c) => c.specialty === option).length
          }
        />
        <CommandCombobox
          options={availableServiceAreas}
          placeholder="Service Area"
          selected={serviceAreaFilter}
          onSelectionChange={setServiceAreaFilter}
          getOptionCount={(option) =>
            filteredContractors.filter((c) => c.serviceArea === option).length
          }
        />
        <CommandCombobox
          options={availableRatings}
          placeholder="Rating"
          selected={ratingFilter}
          onSelectionChange={setRatingFilter}
          getOptionCount={(option) =>
            filteredContractors.filter((c) => c.rating >= parseInt(option))
              .length
          }
        />
        <CommandCombobox
          options={["Yes", "No"]}
          placeholder="Emergency"
          selected={emergencyFilter}
          onSelectionChange={setEmergencyFilter}
          getOptionCount={(option) =>
            filteredContractors.filter(
              (c) => c.emergency === (option === "Yes")
            ).length
          }
        />
        <CommandCombobox
          options={["Yes", "No"]}
          placeholder="Insurance"
          selected={insuranceFilter}
          onSelectionChange={setInsuranceFilter}
          getOptionCount={(option) =>
            filteredContractors.filter(
              (c) => c.insurance === (option === "Yes")
            ).length
          }
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Service Area</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Emergency</TableHead>
              <TableHead>Working Hours</TableHead>
              <TableHead>Rate per Hour</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex w-full justify-center items-center">
                    <BeatLoader color="#003366" />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading && paginatedContractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No contractors available
                </TableCell>
              </TableRow>
            ) : (
              !loading &&
              paginatedContractors.length > 0 &&
              paginatedContractors.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell>{contractor.name}</TableCell>
                  <TableCell>{contractor.specialty}</TableCell>
                  <TableCell>{contractor.serviceArea}</TableCell>
                  <TableCell>{contractor.rating.toFixed(1)}</TableCell>
                  <TableCell>{contractor.emergency ? "Yes" : "No"}</TableCell>
                  <TableCell>{`${contractor.startHour}:00 - ${contractor.endHour}:00`}</TableCell>
                  <TableCell>${contractor.ratePerHour}/hr</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        <div className="grid gap-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Contractor</DialogTitle>
                              </DialogHeader>
                              <ContractorForm
                                onSubmit={handleEditContractor}
                                initialData={contractor}
                              />
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the contractor from the
                                  database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteContractor(contractor.id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
      {paginatedContractors && paginatedContractors.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {paginatedContractors.length} of{" "}
            {filteredContractors.length} contractors
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
              {selected.map((item) => (
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
              ))}
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

function ContractorForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: Contractor) => void;
  initialData?: Contractor;
}) {
  const form = useForm<z.infer<typeof ContractorSchema>>({
    resolver: zodResolver(ContractorSchema),
    defaultValues: initialData || {
      name: "",
      specialty: "",
      companyName: "",
      phoneNumber: "",
      email: "",
      licenseNumber: "",
      yearsOfExperience: 0,
      serviceArea: "",
      availability: [],
      startHour: 9,
      endHour: 17,
      emergency: false,
      rating: 0,
      insurance: false,
      ratePerHour: 0,
    },
  });

  function onFormSubmit(values: z.infer<typeof ContractorSchema>) {
    onSubmit({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      ...values,
    });
  }

  return (
    <ScrollArea className="h-[400px] md:h-[600px] px-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="space-y-8 px-2"
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
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Plumbing Co." {...field} />
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
                  <Input placeholder="+1 (555) 000-0000" {...field} />
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
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number</FormLabel>
                <FormControl>
                  <Input placeholder="LIC-12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Area</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Availability</FormLabel>
                  <FormDescription>
                    Select the days when the contractor is available.
                  </FormDescription>
                </div>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <FormField
                    key={day}
                    control={form.control}
                    name="availability"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, day])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== day
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{day}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Hour</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start hour" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour.toString().padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Hour</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end hour" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour.toString().padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergency"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Emergency Services</FormLabel>
                  <FormDescription>
                    This contractor offers emergency services.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Rate from 0 to 5 stars</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insurance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Insurance</FormLabel>
                  <FormDescription>
                    This contractor has insurance coverage.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ratePerHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate per Hour</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button className="bg-custom-1 hover:bg-custom-1" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
