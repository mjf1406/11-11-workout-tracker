import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { EditExerciseDialog } from "./EditExerciseDialog";
import { deleteExercise } from "../actions";
import type { ExerciseWithFormattedDays } from "../ExercisesClient";

type ExerciseActionsCellProps = {
  exercise: ExerciseWithFormattedDays;
};

export function ExerciseActionsCell({ exercise }: ExerciseActionsCellProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              void deleteExercise(exercise?.id);
              window.location.reload();
            }}
          >
            <Trash className="mr-2" /> Delete exercise
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2" /> Edit exercise
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditExerciseDialog
        exercise={exercise}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
      />
    </>
  );
}
