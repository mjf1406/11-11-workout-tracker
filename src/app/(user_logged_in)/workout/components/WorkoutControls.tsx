// components/WorkoutControls.tsx
import React from "react";
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
import CancelWorkout from "./CancelWorkout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkout } from "../actions";
import { toast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { FilteredWorkoutData } from "~/server/db/types";

interface WorkoutControlsProps {
  onFinishWorkout: () => Promise<FilteredWorkoutData | null>;
}

export const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  onFinishWorkout,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const createWorkoutMutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      toast({
        title: "Workout saved",
        description: "Your workout has been successfully saved.",
      });
      void queryClient.invalidateQueries({ queryKey: ["workout"] });
    },
    onError: (error) => {
      console.error("Failed to save workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFinishWorkout = async () => {
    const workoutData = await onFinishWorkout();
    if (workoutData) {
      router.prefetch("/workout/complete");
      createWorkoutMutation.mutate(workoutData);
      setIsDialogOpen(false);
      router.push("/workout/complete");
    } else {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="left-0 right-0 flex justify-center gap-5">
      <CancelWorkout />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <BicepsFlexed />
            <span className="hidden sm:inline">Finish workout</span>
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleFinishWorkout}
              disabled={createWorkoutMutation.isPending}
              className="mb-4"
            >
              {createWorkoutMutation.isPending ? (
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
    </div>
  );
};
