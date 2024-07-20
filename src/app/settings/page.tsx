import { Suspense } from "react";
import { getSettings } from "./actions";
import MainNav from "~/components/navigation/MainNav";
import SettingsForm from "./SettingsForm";
import type { SettingsDb } from "~/server/db/types";

export default async function SettingsPage() {
  const settings: SettingsDb[] = await getSettings(); // Fetch current settings

  return (
    <>
      <MainNav />
      <div className="container mx-auto py-10">
        <h2 className="mb-5 text-center text-4xl">Settings</h2>
        <Suspense fallback={<div>Loading form...</div>}>
          <div className="m-auto flex w-full items-center justify-center">
            <div className="max-w-[500px]">
              <SettingsForm initialSettings={settings} />
            </div>
          </div>
        </Suspense>
      </div>
    </>
  );
}
