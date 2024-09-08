import { Suspense } from "react";
import { ContentLayout } from "~/components/admin-panel/content-layout";
import WorkoutContent from "./WorkoutContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Link from "next/link";
import LoadingData from "~/components/LoadingData";

export default function WorkoutPage() {
  return (
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
      <Suspense fallback={<LoadingData />}>
        <WorkoutContent />
      </Suspense>
    </ContentLayout>
  );
}
