"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Loader2, Plus } from "lucide-react";
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
import type { ExerciseDb } from "~/server/db/types";

export function CreateExerciseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [variant, setVariant] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [type, setType] = useState("");
  const { isLoaded, userId } = useAuth();
  const [isLoading, setLoading] = useState(false);

  if (!isLoaded || !userId) {
    return null;
  }

  const resetForm = () => {
    setName("");
    setVariant("");
    setBodyPart("");
    setType("");
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
