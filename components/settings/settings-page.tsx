import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from "@prisma/client";

export type UserType = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phoneNumber: string | null;
  role: UserRole;
};

export const UserSettings = ({ user }: { user: UserType }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.image);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg p-4 mb-4 shadow-md">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-40 h-40">
              <AvatarImage
                src={profilePicture || ""}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-custom-3">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="picture" className="cursor-pointer mt-4">
              <span className="bg-custom-1 text-primary-foreground px-4 py-2 rounded-md">
                Change Picture
              </span>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </Label>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue={user.phoneNumber || ""}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="two-factor"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                className="data-[state=checked]:bg-custom-1 data-[state=unchecked]:bg-custom-3"
              />
              <Label htmlFor="two-factor">
                Enable Two-Factor Authentication
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-custom-1 hover:bg-custom-1">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="account" className="mt-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          {user.role === "TENANT" && (
            <TabsTrigger value="rental">Rental</TabsTrigger>
          )}
          {user.role === "MANAGER" && (
            <TabsTrigger value="properties">Properties</TabsTrigger>
          )}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Input id="language" defaultValue="English" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="UTC-5" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {user.role === "TENANT" && (
          <TabsContent value="rental">
            <Card>
              <CardHeader>
                <CardTitle>Rental Preferences</CardTitle>
                <CardDescription>
                  Manage your rental settings and payments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-pay"
                    className="data-[state=checked]:bg-custom-1 data-[state=unchecked]:bg-custom-3"
                  />
                  <Label htmlFor="auto-pay">
                    Enable Automatic Rent Payments
                  </Label>
                </div>
                <Button variant="outline">View Payment History</Button>
                <Button variant="outline">Submit Maintenance Request</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {user.role === "MANAGER" && (
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  Manage your properties and listings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">Add New Property</Button>
                <Button variant="outline">View Property Listings</Button>
                <Button variant="outline">Generate Financial Reports</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  className="data-[state=checked]:bg-custom-1 data-[state=unchecked]:bg-custom-3"
                />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sms-notifications"
                  className="data-[state=checked]:bg-custom-1 data-[state=unchecked]:bg-custom-3"
                />
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
              </div>
              {user.role === "TENANT" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenance-updates"
                    className="data-[state=checked]:bg-custom-1 data-[state=unchecked]:bg-custom-3"
                  />
                  <Label htmlFor="maintenance-updates">
                    Maintenance Request Updates
                  </Label>
                </div>
              )}
              {user.role === "MANAGER" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-applications"
                    className="data-[state=checked]:bg-custom-1 data-[state=unchecked]:bg-custom-3"
                  />
                  <Label htmlFor="new-applications">
                    New Rental Applications
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
