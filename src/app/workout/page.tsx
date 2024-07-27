"use client";

import React, { useState, useEffect, useRef } from "react";
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

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

const MemoizedMainNav = React.memo(MainNav);

const isLastExercise = (
  exerciseId: number,
  routine?: ExerciseRoutine[],
): boolean => {
  if (!routine || routine.length === 0) {
    return false;
  }

  const lastExercise = routine[routine.length - 1];
  if (lastExercise) {
    return exerciseId === lastExercise.id;
  }

  return false;
};

export default function Workout() {
  const [routine, setRoutine] = useState<ExerciseRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [isFinishLoading, setIsFinishLoading] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(90);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [settings, setSettings] = useState<SettingsDb>();
  const [isStopwatchDrawerOpen, setIsStopwatchDrawerOpen] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);
  const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);
  const [activeExerciseName, setActiveExerciseName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const routine: ExerciseRoutine[] = await handleGenerateRoutine();
        setRoutine(routine);

        const settingsArray: SettingsDb[] = await getSettings();
        const settings: SettingsDb | undefined = settingsArray[0];
        setSettings(settings);
        if (!settings) return;

        setWorkout({
          id: undefined,
          user_id: "",
          exercises: routine.map((exercise) => ({
            id: exercise.id!,
            sets: exercise.sets
              ? exercise.sets.map((set) => ({
                  weight: set.weight,
                  reps: set.reps,
                  isCompleted: false,
                }))
              : Array(settings.sets).fill({
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

  useEffect(() => {
    if (isStopwatchDrawerOpen) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 100);
      }, 100);
    } else {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current);
      }
      setStopwatchTime(0);
    }

    return () => {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current);
      }
    };
  }, [isStopwatchDrawerOpen]);

  const handleStopwatchStart = (
    exerciseId: number,
    setIndex: number,
    exerciseName: string,
  ) => {
    setActiveExerciseId(exerciseId);
    setActiveSetIndex(setIndex);
    setActiveExerciseName(exerciseName);
    setIsStopwatchDrawerOpen(true);
  };

  const handleStopwatchStop = () => {
    if (activeExerciseId !== null && activeSetIndex !== null) {
      updateSet(activeExerciseId, activeSetIndex, { reps: stopwatchTime });
    }
    setIsStopwatchDrawerOpen(false);
    setActiveExerciseId(null);
    setActiveSetIndex(null);
  };

  useEffect(() => {
    const timerPop = new Audio(
      "https://utfs.io/f/996d6ea5-8313-4d9e-8826-5e4bbf7cbb81-vwnkn.ogg",
    );
    const timerEnd = new Audio(
      "https://utfs.io/f/23579237-c9ce-4d4f-bb2f-528d9a93b773-vwfdt.ogg",
    );
    if (isResting && restTimer > 0) {
      timerRef.current = setInterval(() => {
        setRestTimer((prev) => {
          const newTime = Math.max(0, prev - 100);

          // Play pop sound at 3, 2, and 1 seconds
          if ([4000, 3000, 2000].includes(newTime)) {
            void timerPop.play();
          }

          // Play end sound at 0 seconds
          if (newTime === 1000) {
            void timerEnd.play();
          }

          return newTime;
        });
      }, 100);
    } else if (restTimer === 0) {
      setIsResting(false);
      setIsDrawerOpen(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isResting, restTimer]);

  const startRestTimer = () => {
    setIsResting(true);
    setRestTimer(settings?.rest_duration ?? 90000);
    setIsDrawerOpen(true);
  };

  const adjustRestTimer = (milliseconds: number) => {
    setRestTimer((prev) => Math.max(0, prev + milliseconds));
  };

  const skipRestTimer = () => {
    setIsResting(false);
    setRestTimer(0);
    setIsDrawerOpen(false);
  };

  const formatTime = (milliseconds: number | undefined) => {
    if (!milliseconds) return undefined;
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

      const updatedWorkout = {
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

      const lastExercise = isLastExercise(exerciseId, routine);
      const setJustCompleted = updateData.isCompleted === true;

      if (lastExercise && setJustCompleted) {
        startRestTimer();
      }

      return updatedWorkout;
    });
  };

  const handleAddSet = (exerciseId: number) => {
    setWorkout((prevWorkout) => {
      if (!prevWorkout) return null;
      return {
        ...prevWorkout,
        exercises: prevWorkout.exercises.map((exercise) => {
          if (exercise.id === exerciseId) {
            const newSet = { weight: 0, reps: 0, isCompleted: false };
            return {
              ...exercise,
              sets: [...exercise.sets, newSet],
            };
          }
          return exercise;
        }),
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
      <MemoizedMainNav />
      <main className="flex flex-col items-center justify-center gap-8 bg-background p-5 pb-20 text-foreground">
        <h1 className="text-4xl">Workout</h1>
        <div className="m-auto mb-16 flex w-full flex-col items-center justify-center md:max-w-[500px]">
          {isLoading ? (
            <div className="flex h-96 w-full items-start justify-center">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <span>Loading routine...</span>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {routine.map((exercise) => (
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
                  <div className="flex-grow">
                    <div className="grid grid-cols-7 items-center justify-center space-x-2 text-sm">
                      <div className="col-span-1 text-center">SET</div>
                      <div className="col-span-1 text-center">PREV.</div>
                      <div className="col-span-2 text-center">+WEIGHT</div>
                      <div className="col-span-2 text-center">
                        {exercise.unit.toUpperCase()}
                      </div>
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
                            +
                            {exercise.sets
                              ? exercise.sets[setIndex]?.weight
                              : ""}{" "}
                            x{" "}
                            {exercise.sets &&
                              (exercise.unit === "stopwatch"
                                ? formatTime(exercise.sets[setIndex]?.reps)
                                : exercise.sets[setIndex]?.reps)}
                          </div>
                          <div className="col-span-2 text-center">
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="Weight"
                              defaultValue={
                                exercise.sets
                                  ? exercise.sets[setIndex]?.weight
                                  : ""
                              }
                              onChange={(e) =>
                                updateSet(exercise.id!, setIndex, {
                                  weight: Number(e.target.value),
                                })
                              }
                              className="text-center"
                            />
                          </div>
                          <div className="col-span-2 text-center">
                            {exercise.unit === "stopwatch" ? (
                              <Button
                                className="m-auto w-full"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStopwatchStart(
                                    exercise.id!,
                                    setIndex,
                                    `${exercise.name.titleCase()}, ${exercise.variant}`,
                                  )
                                }
                              >
                                {set.reps ? formatTime(set.reps) : "Start"}
                              </Button>
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                placeholder={
                                  exercise.unit === "reps" ? "Reps" : "Time"
                                }
                                defaultValue={
                                  exercise.sets
                                    ? exercise.sets[setIndex]?.reps
                                    : ""
                                }
                                onChange={(e) =>
                                  updateSet(exercise.id!, setIndex, {
                                    reps: Number(e.target.value),
                                  })
                                }
                                className="text-center"
                              />
                            )}
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
              ))}
            </div>
          )}
        </div>
        <div className="fixed bottom-5 left-0 right-0 flex justify-center gap-5">
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
          {/* Timer Drawer */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              {isResting ? (
                <Button variant="outline">
                  Resting for {formatTime(restTimer)}
                </Button>
              ) : (
                <></>
              )}
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Rest timer</DrawerTitle>
                <DrawerDescription className="text-center text-9xl">
                  {formatTime(restTimer)}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <div className="m-auto flex w-full flex-grow flex-row items-center justify-center gap-5">
                  <Button
                    variant={"ghost"}
                    className="font-bold text-primary/80"
                    onClick={() => adjustRestTimer(-10000)}
                  >
                    -10 sec.
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="font-bold text-primary/80"
                    onClick={() => adjustRestTimer(-30000)}
                  >
                    -30 sec.
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="font-bold text-primary/80"
                    onClick={() => adjustRestTimer(30000)}
                  >
                    +30 sec.
                  </Button>
                  <Button className="min-w-44" onClick={skipRestTimer}>
                    Skip
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          {/* Stopwatch Drawer */}
          <Drawer
            open={isStopwatchDrawerOpen}
            onOpenChange={setIsStopwatchDrawerOpen}
          >
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{activeExerciseName}</DrawerTitle>
                <DrawerDescription className="text-center text-9xl">
                  {formatTime(stopwatchTime)}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="flex flex-row items-center justify-center">
                <Button onClick={handleStopwatchStop} className="w-36">
                  Done
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </main>
    </>
  );
}
