import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { HelpCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { updateExercise } from "../actions";
import type { Days, Exercise } from "~/server/db/types";
import { CheckboxWithLabel } from "~/components/ui/CheckboxWithLabel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import type { ExerciseWithFormattedDays } from "../ExercisesClient";

const dayLabels: readonly string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

type EditExerciseDialogProps = {
  exercise: ExerciseWithFormattedDays;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function EditExerciseDialog({
  exercise,
  isOpen,
  setIsOpen,
}: EditExerciseDialogProps) {
  const [name, setName] = useState(exercise.name);
  const [variant, setVariant] = useState(exercise.variant);
  const [bodyPart, setBodyPart] = useState(exercise.body_part);
  const [type, setType] = useState(exercise.type);
  const [daysOfWeek, setDaysOfWeek] = useState<Days>(
    exercise.forced_days ?? [],
  );
  const [unit, setUnit] = useState<"reps" | "stopwatch">(exercise.unit);

  const queryClient = useQueryClient();

  const editExerciseMutation = useMutation({
    mutationFn: (updatedExercise: Partial<Exercise> & { id: number }) =>
      updateExercise(updatedExercise.id, updatedExercise),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["exercises"] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Failed to edit exercise:", error);
      // Here you might want to show an error message to the user
    },
  });

  useEffect(() => {
    if (isOpen) {
      setName(exercise.name);
      setVariant(exercise.variant);
      setBodyPart(exercise.body_part);
      setType(exercise.type);
      setUnit(exercise.unit);
      setDaysOfWeek(exercise.forced_days ?? []);
    }
  }, [isOpen, exercise]);

  const onCheckChanged = (day: 1 | 2 | 3 | 4 | 5 | 6 | 7 | "all") => {
    if (day === "all") {
      const allChecked = daysOfWeek.length === 7;
      setDaysOfWeek(allChecked ? [] : [1, 2, 3, 4, 5, 6, 7]);
    } else {
      setDaysOfWeek((prevDays) => {
        if (prevDays.includes(day)) {
          return prevDays.filter((d) => d !== day);
        } else {
          return [...prevDays, day];
        }
      });
    }
  };

  const isAllChecked = daysOfWeek.length === 7;

  function handleEditExercise(updatedExercise: Partial<Exercise>) {
    editExerciseMutation.mutate({ ...updatedExercise, id: exercise.id });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription>
            Edit the exercise details here. Click Save changes when done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditExercise({
              name: name,
              variant: variant,
              body_part: bodyPart,
              type: type,
              unit: unit,
              forced_days: daysOfWeek,
            });
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                className="col-span-3"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variant" className="text-right">
                Variant
              </Label>
              <Input
                id="variant"
                value={variant}
                className="col-span-3"
                onChange={(e) => setVariant(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body_part" className="text-right">
                Body Part
              </Label>
              <Select value={bodyPart} onValueChange={setBodyPart} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Body Part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upper">Upper</SelectItem>
                  <SelectItem value="lower">Lower</SelectItem>
                  <SelectItem value="abs">Abs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">N/A</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="pull">Pull</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Unit
              </Label>
              <RadioGroup
                className="col-span-3 flex flex-row gap-2"
                value={unit}
                onValueChange={(value: "reps" | "stopwatch") => setUnit(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reps" id="r1" />
                  <Label htmlFor="r1">Reps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stopwatch" id="r2" />
                  <Label htmlFor="r2">Stopwatch</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-row items-center justify-end gap-1">
                      <HelpCircle className="h-4 w-4" />
                      <Label htmlFor="body_part" className="text-right">
                        Forced
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Choose which days of the week the exercise will always be
                      added as an extra exercise
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="col-span-3 m-auto flex w-full flex-row flex-wrap gap-2">
                <div className="m-auto w-full">
                  <CheckboxWithLabel
                    id="all"
                    label="Everyday"
                    checked={isAllChecked}
                    onCheckedChange={() => onCheckChanged("all")}
                  />
                </div>
                {([1, 2, 3, 4, 5, 6, 7] as const).map((day) => (
                  <CheckboxWithLabel
                    key={day}
                    id={String(day)}
                    label={dayLabels[day - 1] ?? "Error"}
                    checked={daysOfWeek.includes(day)}
                    onCheckedChange={() => onCheckChanged(day)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                editExerciseMutation.isPending || !name || !bodyPart || !unit
              }
            >
              {editExerciseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
