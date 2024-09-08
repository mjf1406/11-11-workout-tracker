import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ContentLayout } from "~/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import { fetchSettings } from "~/app/api/fetchers";
import SettingsFormClient from "./SettingsFormClient";
import { Suspense } from "react";
import LoadingData from "~/components/LoadingData";

export default async function SettingsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentLayout title="Settings">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Suspense fallback={<LoadingData />}>
          <main className="m-auto flex w-full items-center justify-center p-5">
            <SettingsFormClient />
          </main>
        </Suspense>
      </ContentLayout>
    </HydrationBoundary>
  );
}
