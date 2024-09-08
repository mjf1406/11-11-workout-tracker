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

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  await queryClient.prefetchQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  await queryClient.prefetchQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

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
        <main className="flex flex-col items-center justify-center gap-8 p-5 text-foreground">
          <div className="text-2xl">🚧UNDER CONSTRUCTION🚧</div>
        </main>
      </ContentLayout>
    </HydrationBoundary>
  );
}
