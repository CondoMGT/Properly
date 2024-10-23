"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Upload, Plus } from "lucide-react";
import { toast } from "sonner";

type Contractor = {
  id: string;
  name: string;
  specialty: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  yearsOfExperience: number;
  serviceArea: string;
  availability: string[];
  emergency: boolean;
  rating: number;
  insurance: boolean;
  ratePerHour: number;
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
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Contractor[]>(
    []
  );
  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [serviceAreaFilter, setServiceAreaFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState<boolean | null>(null);

  const handleFilterChange = () => {
    let filtered = contractors;
    if (nameFilter) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (specialtyFilter) {
      filtered = filtered.filter((c) => c.specialty === specialtyFilter);
    }
    if (serviceAreaFilter) {
      filtered = filtered.filter((c) => c.serviceArea === serviceAreaFilter);
    }
    if (ratingFilter) {
      filtered = filtered.filter((c) => c.rating >= parseFloat(ratingFilter));
    }
    if (emergencyFilter !== null) {
      filtered = filtered.filter((c) => c.emergency === emergencyFilter);
    }
    setFilteredContractors(filtered);
  };

  const handleAddContractor = (newContractor: Contractor) => {
    setContractors([...contractors, newContractor]);
    handleFilterChange();
    toast.success("Contractor Added", {
      description: `${newContractor.name} has been added to the list.`,
    });
  };

  const handleExport = () => {
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
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split("\n");
        const newContractors: Contractor[] = lines.slice(1).map((line) => {
          const [
            name,
            specialty,
            phoneNumber,
            email,
            licenseNumber,
            yearsOfExperience,
            serviceArea,
            availability,
            emergency,
            rating,
            insurance,
            ratePerHour,
          ] = line.split(",");
          return {
            id: Math.random().toString(36).substr(2, 9),
            name,
            specialty,
            phoneNumber,
            email,
            licenseNumber,
            yearsOfExperience: parseInt(yearsOfExperience),
            serviceArea,
            availability: availability.split(";"),
            emergency: emergency === "true",
            rating: parseFloat(rating),
            insurance: insurance === "true",
            ratePerHour: parseInt(ratePerHour),
          };
        });
        setContractors([...contractors, ...newContractors]);
        handleFilterChange();
        toast.success("Contractors Imported", {
          description: `${newContractors.length} contractors have been imported.`,
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contractor Management</h1>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Contractor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contractor</DialogTitle>
              </DialogHeader>
              <AddContractorForm onAdd={handleAddContractor} />
            </DialogContent>
          </Dialog>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button asChild>
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
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            handleFilterChange();
          }}
        />
        <Select
          onValueChange={(value) => {
            setSpecialtyFilter(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Specialties</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            setServiceAreaFilter(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by service area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Service Areas</SelectItem>
            {serviceAreas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            setRatingFilter(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Ratings</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
            <SelectItem value="1">1+ Stars</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            setEmergencyFilter(value === "" ? null : value === "true");
            handleFilterChange();
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by emergency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="true">Emergency</SelectItem>
            <SelectItem value="false">Non-Emergency</SelectItem>
          </SelectContent>
        </Select>
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
              <TableHead>Rate per Hour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No contractors available
                </TableCell>
              </TableRow>
            ) : (
              filteredContractors.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell>{contractor.name}</TableCell>
                  <TableCell>{contractor.specialty}</TableCell>
                  <TableCell>{contractor.serviceArea}</TableCell>
                  <TableCell>{contractor.rating.toFixed(1)}</TableCell>
                  <TableCell>{contractor.emergency ? "Yes" : "No"}</TableCell>
                  <TableCell>${contractor.ratePerHour}/hr</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

function AddContractorForm({
  onAdd,
}: {
  onAdd: (contractor: Contractor) => void;
}) {
  const [newContractor, setNewContractor] = useState<Partial<Contractor>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newContractor.name &&
      newContractor.specialty &&
      newContractor.serviceArea
    ) {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        name: newContractor.name,
        specialty: newContractor.specialty,
        phoneNumber: newContractor.phoneNumber || "",
        email: newContractor.email || "",
        licenseNumber: newContractor.licenseNumber || "",
        yearsOfExperience: newContractor.yearsOfExperience || 0,
        serviceArea: newContractor.serviceArea,
        availability: newContractor.availability || [],
        emergency: newContractor.emergency || false,
        rating: newContractor.rating || 0,
        insurance: newContractor.insurance || false,
        ratePerHour: newContractor.ratePerHour || 0,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={newContractor.name || ""}
          onChange={(e) =>
            setNewContractor({ ...newContractor, name: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Select
          onValueChange={(value) =>
            setNewContractor({ ...newContractor, specialty: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="serviceArea">Service Area</Label>
        <Select
          onValueChange={(value) =>
            setNewContractor({ ...newContractor, serviceArea: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select service area" />
          </SelectTrigger>
          <SelectContent>
            {serviceAreas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="emergency">Emergency Services</Label>
        <Checkbox
          id="emergency"
          checked={newContractor.emergency || false}
          onCheckedChange={(checked) =>
            setNewContractor({
              ...newContractor,
              emergency: checked as boolean,
            })
          }
        />
      </div>
      <div>
        <Label htmlFor="ratePerHour">Rate per Hour</Label>
        <Input
          id="ratePerHour"
          type="number"
          value={newContractor.ratePerHour || ""}
          onChange={(e) =>
            setNewContractor({
              ...newContractor,
              ratePerHour: parseInt(e.target.value),
            })
          }
        />
      </div>
      <Button type="submit">Add Contractor</Button>
    </form>
  );
}
