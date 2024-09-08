import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ContentLayout } from "~/components/admin-panel/content-layout";
import WorkoutClient from "./WorkoutClient";
import {
  fetchExercises,
  fetchSettings,
  fetchWorkouts,
} from "~/app/api/fetchers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Link from "next/link";

export default async function WorkoutPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  await queryClient.prefetchQuery({
    queryKey: ["routine"],
    queryFn: fetchExercises,
  });

  await queryClient.prefetchQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentLayout title="Workout">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Workout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <WorkoutClient />
      </ContentLayout>
    </HydrationBoundary>
  );
}
