// app/(user_logged_in)/exercises/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ContentLayout } from "~/components/admin-panel/content-layout";
import ExercisesClient from "./ExercisesClient";
import { fetchExercises } from "~/app/api/fetchers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import { Suspense } from "react";
import LoadingData from "~/components/LoadingData";

export default async function ExercisesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentLayout title="Exercises">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Exercises</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Suspense fallback={<LoadingData />}>
          <ExercisesClient />
        </Suspense>
      </ContentLayout>
    </HydrationBoundary>
  );
}
