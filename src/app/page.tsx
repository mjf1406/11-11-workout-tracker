import { Activity } from "lucide-react";
import Link from "next/link";
import { ContentLayout } from "~/components/admin-panel/content-layout";
import FrequentlyAskedQuestions from "~/components/brand/FAQ";
import LoadingButton from "~/components/LoadingButton";
import { Button } from "~/components/ui/button";
import { APP_NAME } from "~/lib/constants";

export default function HomePage() {
  return (
    <ContentLayout title={APP_NAME}>
      <main className="flex min-h-screen flex-col items-center justify-center gap-32 bg-background p-5 text-foreground">
        <div
          id="hero"
          className="container flex h-dvh flex-col items-center justify-center gap-12 px-4 py-16"
        >
          <div className="flex items-center gap-3">
            <h1 className="flex flex-col text-5xl font-extrabold tracking-tight">
              <span className="text-primary">Your exercises.</span>
              <span className="text-accent">Uniformly shuffled.</span>
            </h1>
          </div>
          <div className="max-w-lg text-center text-xl tracking-tight md:text-2xl">
            Say goodbye to workout planning! With our randomized 11-11 workouts,
            you&apos;ll get a fresh set of exercises every day. Just focus on
            giving 100% and we&apos;ll ensure you never repeat the same routine
            (within reason).
          </div>
          <div className="flex gap-5">
            <LoadingButton href="/workout">
              <div className="flex items-center justify-center">
                <Activity className="mr-2" /> Workout
              </div>
            </LoadingButton>
            <Button asChild variant={"secondary"}>
              <Link href={"#features"}>Learn more</Link>
            </Button>
          </div>
        </div>
        <div className="container flex h-dvh flex-col items-center justify-center gap-12 px-4 py-16">
          <h2 id="features" className="scroll-m-20 text-4xl">
            Features
          </h2>
        </div>
        <div className="container flex h-dvh flex-col items-center justify-center gap-12 px-4 py-16">
          <h2 id="pricing" className="scroll-m-20 text-4xl">
            Pricing
          </h2>
        </div>
        <FrequentlyAskedQuestions />
      </main>
    </ContentLayout>
  );
}
