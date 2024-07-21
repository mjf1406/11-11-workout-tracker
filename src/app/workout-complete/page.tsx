import { ExternalLink } from "lucide-react";
import MainNav from "~/components/navigation/MainNav";
import { Blockquote } from "~/components/typography/blockquote";

export default function WorkoutCompletePage() {
  return (
    <>
      <MainNav />
      <div className="container mx-auto py-10">
        <h2 className="mb-5 text-center text-4xl">Workout Complete</h2>
        <h3 className="mb-5 text-center text-2xl">🎉Congratulations!🎉</h3>
        <p className="m-auto w-full max-w-lg text-center">
          Remember, it takes about six weeks to form a new exercise habit,
          according to{" "}
          <a
            className="inline-flex items-center underline"
            href="https://www.scientificamerican.com/article/how-long-does-it-really-take-to-form-a-habit/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scientific American
            <ExternalLink className="ml-1 inline-block h-4 w-4" />
          </a>
          .
        </p>
        <Blockquote className="m-auto w-full max-w-md">
          A 2015 study found that new gym-goers had to exercise at least four
          times a week for six weeks in order to develop an exercise habit.
        </Blockquote>
      </div>
    </>
  );
}
