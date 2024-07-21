"use client";

import React, { useState, useEffect } from "react";
import { Loader2, BicepsFlexed } from "lucide-react";
import { useRouter } from "next/navigation";
import MainNav from "~/components/navigation/MainNav";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
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
import { toast } from "~/components/ui/use-toast";
import type {
  ExerciseRoutine,
  SettingsDb,
  Workout as WorkoutType,
} from "~/server/db/types";
import { handleGenerateRoutine, saveWorkout } from "./actions";
import { getSettings } from "../settings/actions";
import CancelWorkout from "./CancelWorkout";
import "~/utils/string-extensions";

interface SetData {
  weight: number;
  reps: number;
  isCompleted: boolean;
}

interface ExerciseData {
  id: number;
  sets: SetData[];
}

interface WorkoutData extends Omit<WorkoutType, "exercises"> {
  exercises: ExerciseData[];
}

export default function Workout() {
  const [routine, setRoutine] = useState<ExerciseRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [isFinishLoading, setIsFinishLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const routine: ExerciseRoutine[] = await handleGenerateRoutine();
        console.log("🚀 ~ fetchRoutine ~ routine:", routine);
        setRoutine(routine);

        const settingsArray: SettingsDb[] = await getSettings();
        const settings: SettingsDb | undefined = settingsArray[0];
        if (!settings) return;

        setWorkout({
          id: undefined,
          user_id: "",
          exercises: routine.map((exercise) => ({
            id: exercise.id!,
            sets: Array(settings.sets).fill({
              weight: 0,
              reps: 0,
              isCompleted: false,
            }),
          })),
          created_date: undefined,
          updated_date: undefined,
        });
      } catch (error) {
        console.error("Error generating routine:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRoutine();
  }, []);

  const isSetCompleted = (exerciseId: number, setIndex: number): boolean => {
    return !!workout?.exercises.find((e) => e.id === exerciseId)?.sets[setIndex]
      ?.isCompleted;
  };

  const updateSet = (
    exerciseId: number,
    setIndex: number,
    updateData: Partial<SetData>,
  ) => {
    setWorkout((prevWorkout) => {
      if (!prevWorkout) return null;
      return {
        ...prevWorkout,
        exercises: prevWorkout.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set, i) =>
                  i === setIndex ? { ...set, ...updateData } : set,
                ),
              }
            : exercise,
        ),
      };
    });
  };

  const handleAddSet = (exerciseId: number) => {
    setWorkout((prevWorkout) => {
      if (!prevWorkout) return null;
      return {
        ...prevWorkout,
        exercises: prevWorkout.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: [
                  ...exercise.sets,
                  { weight: 0, reps: 0, isCompleted: false },
                ],
              }
            : exercise,
        ),
      };
    });
  };

  const handleFinishWorkout = async () => {
    setIsFinishLoading(true);
    try {
      if (workout) {
        const filteredWorkout = {
          ...workout,
          exercises: workout.exercises
            .map((exercise) => ({
              ...exercise,
              sets: exercise.sets
                .filter((set) => set.isCompleted)
                .map(({ weight, reps }) => ({ weight, reps })),
            }))
            .filter((exercise) => exercise.sets.length > 0),
        };

        if (filteredWorkout.exercises.length === 0) {
          toast({
            title: "No completed exercises",
            description:
              "Please complete at least one set of an exercise before finishing the workout.",
            variant: "destructive",
          });
          setIsFinishLoading(false);
          return;
        }

        await saveWorkout(filteredWorkout as WorkoutType);
        toast({
          title: "Workout saved",
          description: "Your workout has been successfully saved.",
        });
        router.push("/workout-complete");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFinishLoading(false);
    }
  };

  return (
    <>
      <MainNav />
      <main className="flex flex-col items-center justify-center gap-8 bg-background p-5 text-foreground">
        <h1 className="text-4xl">Workout</h1>
        <div className="m-auto flex w-full flex-col items-center justify-center md:max-w-[500px]">
          {isLoading ? (
            <div className="flex flex-row gap-2">
              <Loader2 className="animate-spin" /> Loading routine...
            </div>
          ) : (
            routine.map((exercise) => (
              <div
                key={exercise.id}
                className="mb-4 flex flex-col gap-2 rounded-xl bg-foreground/10 px-4 py-1"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  {exercise.name.titleCase()}
                  {exercise.variant ? `, ${exercise.variant}` : ""}
                </h2>
                <div className="-mt-3 text-xs">
                  {exercise.body_part}{" "}
                  {exercise.type ? `- ${exercise.type}` : ``}
                </div>
                <div>
                  <div className="grid grid-cols-7 items-center justify-center space-x-2 text-sm">
                    <div className="col-span-1 text-center">SET</div>
                    <div className="col-span-1 text-center">PREV.</div>
                    <div className="col-span-2 text-center">+WEIGHT</div>
                    <div className="col-span-2 text-center">REPS</div>
                    <div className="col-span-1 text-center text-lg">✓</div>
                  </div>
                  {workout?.exercises
                    .find((e) => e.id === exercise.id)
                    ?.sets.map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className={`mb-0.5 grid grid-cols-7 items-center justify-center space-x-2 py-1 text-sm ${
                          isSetCompleted(exercise.id!, setIndex)
                            ? "bg-secondary"
                            : ""
                        }`}
                      >
                        <div className="col-span-1 text-center">
                          {setIndex + 1}
                        </div>
                        <div className="col-span-1 text-center">
                          +{exercise.previous_weight} x {exercise.previous_reps}
                        </div>
                        <div className="col-span-2 text-center">
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder="Weight"
                            defaultValue={exercise.previous_weight}
                            onChange={(e) =>
                              updateSet(exercise.id!, setIndex, {
                                weight: Number(e.target.value),
                              })
                            }
                            className="text-center"
                          />
                        </div>
                        <div className="col-span-2 text-center">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Reps"
                            defaultValue={exercise.previous_reps}
                            onChange={(e) =>
                              updateSet(exercise.id!, setIndex, {
                                reps: Number(e.target.value),
                              })
                            }
                            className="text-center"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Checkbox
                            checked={set.isCompleted}
                            onCheckedChange={(checked) =>
                              updateSet(exercise.id!, setIndex, {
                                isCompleted: checked as boolean,
                              })
                            }
                            className="h-8 w-8"
                          />
                        </div>
                      </div>
                    ))}
                </div>
                <Button
                  variant="ghost"
                  className="-mt-2 w-full font-bold text-primary/80"
                  onClick={() => handleAddSet(exercise.id!)}
                >
                  Add set
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-5">
          <CancelWorkout />
          <Dialog>
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
                  disabled={isFinishLoading}
                >
                  {isFinishLoading ? (
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
      </main>
    </>
  );
}
