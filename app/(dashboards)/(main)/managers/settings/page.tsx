"use client";

import { UserSettings, UserType } from "@/components/settings/settings-page";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
  const user = useCurrentUser();

  return <UserSettings user={user as UserType} />;
};

export default SettingsPage;
