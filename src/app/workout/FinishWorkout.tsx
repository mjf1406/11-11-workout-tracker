"use client";

import { useState } from "react";
import { BicepsFlexed, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { saveWorkout } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "~/components/ui/use-toast";
import type { Workout } from "~/server/db/types";

interface FinishWorkoutProps {
  workout: Workout;
}

export default function FinishWorkout({ workout }: FinishWorkoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFinishWorkout = async () => {
    setIsLoading(true);
    try {
      const savedWorkout = await saveWorkout(workout);
      toast({
        title: "Workout saved",
        description: "Your workout has been successfully saved.",
      });
      router.push("/workouts"); // Redirect to workouts page or wherever you want
    } catch (error) {
      console.error("Failed to save workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <BicepsFlexed />{" "}
          <span className="hidden pl-2 sm:inline">Finish workout</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finish Workout</DialogTitle>
          <DialogDescription>
            Are you sure you want to finish and save this workout?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={handleFinishWorkout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Finish workout"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
