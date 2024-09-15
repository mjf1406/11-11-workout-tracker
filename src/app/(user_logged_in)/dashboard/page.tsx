import { ContentLayout } from "~/components/admin-panel/content-layout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import {
  fetchExercises,
  fetchSettings,
  fetchWorkouts,
} from "~/app/api/fetchers";
import { Suspense } from "react";
import LoadingData from "~/components/LoadingData";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["settings"],
      queryFn: fetchSettings,
    }),
    queryClient.prefetchQuery({
      queryKey: ["exercises"],
      queryFn: fetchExercises,
    }),
    queryClient.prefetchQuery({
      queryKey: ["workouts"],
      queryFn: fetchWorkouts,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentLayout title="Dashboard">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Suspense fallback={<LoadingData />}>
          <DashboardClient />
        </Suspense>
      </ContentLayout>
    </HydrationBoundary>
  );
}
