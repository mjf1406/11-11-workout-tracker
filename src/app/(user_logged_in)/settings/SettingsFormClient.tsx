"use client";

import { useSettings } from "./hooks";
import SettingsForm from "./SettingsForm";

export default function SettingsFormClient() {
  const { data: settings, isLoading, error } = useSettings();

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div>Error loading settings: {error.message}</div>;
  if (!settings) return <div>There are no settings.</div>;

  return <SettingsForm initialSettings={settings} />;
}
