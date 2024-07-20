import { Dumbbell } from "lucide-react";
import Link from "next/link";
import FrequentlyAskedQuestions from "~/components/brand/FAQ";
import MainNav from "~/components/navigation/MainNav";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <>
      <MainNav />
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
            <Button asChild>
              <Link href={"/workout"}>
                <Dumbbell className="mr-2" /> Workout
              </Link>
            </Button>
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
    </>
  );
}
