import { GripVertical } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import type { Exercise } from "~/server/db/types";
import { safeTitleCase } from "~/utils/stringUtils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ExerciseProps {
  exercise: Exercise & {
    sets: { weight: number; reps: number; isNewSet: boolean }[];
  };
  onUpdateSet: (
    exerciseId: number,
    setIndex: number,
    updateData: { weight?: number; reps?: number },
  ) => void;
  onAddSet: (exerciseId: number) => void;
  onStopwatchStart: (
    exerciseId: number,
    setIndex: number,
    exerciseName: string,
  ) => void;
  formatTime: (milliseconds: number | undefined) => string | undefined;
  isSetCompleted: (exerciseId: number, setIndex: number) => boolean;
  onSetComplete: (
    exerciseId: number,
    setIndex: number,
    isCompleted: boolean,
  ) => void;
}

export const ExerciseComponent: React.FC<ExerciseProps> = ({
  exercise,
  onUpdateSet,
  onAddSet,
  onStopwatchStart,
  formatTime,
  isSetCompleted,
  onSetComplete,
}) => {
  const [isInteractingWithInput, setIsInteractingWithInput] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: exercise.id,
    disabled: isInteractingWithInput,
  });

  useEffect(() => {
    setIsDragging(isSortableDragging);
  }, [isSortableDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDragHandleMouseDown = (e: React.MouseEvent) => {
    if (dragHandleRef.current?.contains(e.target as Node)) {
      setIsInteractingWithInput(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 flex flex-col gap-2 rounded-xl bg-foreground/10 px-4 py-1"
    >
      <div className="grid grid-cols-10">
        <div
          ref={dragHandleRef}
          className="col-span-1 -ml-5 touch-none self-center"
          {...attributes}
          {...listeners}
          onMouseDown={handleDragHandleMouseDown}
        >
          <GripVertical size={40} className="cursor-move" />
        </div>
        <div className="col-span-9 -ml-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            {safeTitleCase(exercise.name)}
            {exercise.variant ? `, ${exercise.variant}` : ""}
          </h2>
          <div className="-mt-3 text-xs">
            {exercise.body_part} {exercise.type ? `- ${exercise.type}` : ``}
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
            {exercise.sets.map((set, setIndex) => (
              <div
                key={setIndex}
                className={`mb-0.5 grid grid-cols-7 items-center justify-center space-x-2 py-1 text-sm ${
                  isSetCompleted(exercise.id, setIndex) ? "bg-secondary" : ""
                }`}
              >
                <div className="col-span-1 text-center">{setIndex + 1}</div>
                <div className="col-span-1 text-center">
                  {set.isNewSet
                    ? "N/A"
                    : exercise.unit === "stopwatch"
                      ? formatTime(set.reps)
                      : set.weight > 0 || set.reps > 0
                        ? `${set.weight} x ${set.reps}`
                        : "-"}
                </div>
                <div className="col-span-2 text-center">
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Weight"
                    value={set.weight || ""}
                    onChange={(e) =>
                      onUpdateSet(exercise.id, setIndex, {
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
                        onStopwatchStart(
                          exercise.id,
                          setIndex,
                          `${safeTitleCase(exercise.name)}, ${exercise.variant}`,
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
                      placeholder={exercise.unit === "reps" ? "Reps" : "Time"}
                      value={set.reps || ""}
                      onChange={(e) =>
                        onUpdateSet(exercise.id, setIndex, {
                          reps: Number(e.target.value),
                        })
                      }
                      className="text-center"
                    />
                  )}
                </div>
                <div className="col-span-1 flex justify-center">
                  <Checkbox
                    checked={isSetCompleted(exercise.id, setIndex)}
                    onCheckedChange={(checked) =>
                      onSetComplete(exercise.id, setIndex, checked as boolean)
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
            onClick={() => onAddSet(exercise.id)}
          >
            Add set
          </Button>
        </div>
      </div>
    </div>
  );
};
