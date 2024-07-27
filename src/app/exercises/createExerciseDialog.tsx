"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { HelpCircle, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createExercise } from "./actions";
import { useAuth } from "@clerk/nextjs";
import type { Days, ExerciseDb } from "~/server/db/types";
import { CheckboxWithLabel } from "~/components/ui/CheckboxWithLabel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

const initialDays = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false,
};

export function CreateExerciseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [variant, setVariant] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [type, setType] = useState("");
  const { isLoaded, userId } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState<Days>(initialDays);
  const [unit, setUnit] = useState("reps");

  if (!isLoaded || !userId) {
    return null;
  }

  const onCheckChanged = (day: keyof Days | "all") => {
    if (day === "all") {
      const allChecked = Object.values(daysOfWeek).every((value) => value);
      setDaysOfWeek((prevDays) => {
        const newState = { ...prevDays };
        Object.keys(newState).forEach((key) => {
          newState[key as keyof Days] = !allChecked;
        });
        return newState;
      });
    } else {
      setDaysOfWeek((prevDays) => ({
        ...prevDays,
        [day]: !prevDays[day],
      }));
    }
  };

  const isAllChecked = Object.values(daysOfWeek).every((value) => value);

  const resetForm = () => {
    setName("");
    setVariant("");
    setBodyPart("");
    setType("");
    setDaysOfWeek(initialDays);
    setUnit("");
  };

  async function handleCreateExercise(userId: string, exercise: ExerciseDb) {
    setLoading(true);
    try {
      await createExercise(userId, exercise);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create exercise:", error);
      // Here you might want to show an error message to the user
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2" />
          Create exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
          <DialogDescription>
            Create an exercise here. Click Create exercise when done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreateExercise(userId, {
              id: undefined,
              user_id: userId,
              name: name,
              variant: variant,
              body_part: bodyPart,
              type: type,
              used: false,
              unit: unit as "reps" | "stopwatch",
              forced_days: daysOfWeek,
              created_date: undefined,
              updated_date: undefined,
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
                defaultValue="comfortable"
                value={unit}
                onValueChange={setUnit}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reps" id="r1" />
                  <Label htmlFor="r1">Reps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stopwatch" id="r2" />
                  <Label htmlFor="r2">Stopwatch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="timer" id="r3" />
                  <Label htmlFor="r3">Timer</Label>
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
                {Object.entries(daysOfWeek).map(([day, checked]) => (
                  <CheckboxWithLabel
                    key={day}
                    id={day}
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    checked={checked}
                    onCheckedChange={() => onCheckChanged(day as keyof Days)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !name || !bodyPart}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create exercise"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
