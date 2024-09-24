import React, { useState, useEffect } from "react";
import { ExerciseComponent } from "./Exercise";
import type { Exercise, Workout } from "~/server/db/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface WorkoutData extends Omit<Workout, "exercises"> {
  exercises: (Exercise & {
    sets: { weight: number; reps: number; isNewSet: boolean }[];
  })[];
}

interface WorkoutExerciseListProps {
  workout: WorkoutData;
  completedSets: Record<number, boolean[]>;
  onUpdateSet: (
    exerciseId: number,
    setIndex: number,
    updateData: { weight?: number; reps?: number },
  ) => void;
  onAddSet: (exerciseId: number) => void;
  onSetComplete: (
    exerciseId: number,
    setIndex: number,
    isCompleted: boolean,
  ) => void;
  onStopwatchStart: (
    exerciseId: number,
    setIndex: number,
    exerciseName: string,
  ) => void;
}

const formatTime = (milliseconds: number | undefined) => {
  if (!milliseconds) return undefined;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const WorkoutExerciseList: React.FC<WorkoutExerciseListProps> = ({
  workout,
  completedSets,
  onUpdateSet,
  onAddSet,
  onSetComplete,
  onStopwatchStart,
}) => {
  const [exercises, setExercises] = useState<WorkoutData["exercises"]>(
    workout.exercises,
  );

  useEffect(() => {
    setExercises(workout.exercises);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleLocalUpdateSet = (
    exerciseId: number,
    setIndex: number,
    updateData: { weight?: number; reps?: number },
  ) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, index) =>
                index === setIndex ? { ...set, ...updateData } : set,
              ),
            }
          : exercise,
      ),
    );
    onUpdateSet(exerciseId, setIndex, updateData);
  };

  const handleLocalAddSet = (exerciseId: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [...exercise.sets, { weight: 0, reps: 0, isNewSet: true }],
            }
          : exercise,
      ),
    );
    onAddSet(exerciseId);
  };

  return (
    <div className="m-auto flex w-full flex-col items-center justify-center md:max-w-[500px]">
      <div className="w-full space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={exercises}
            strategy={verticalListSortingStrategy}
          >
            {exercises.map((exercise) => (
              <ExerciseComponent
                key={exercise.id}
                exercise={exercise}
                onUpdateSet={handleLocalUpdateSet}
                onAddSet={handleLocalAddSet}
                onStopwatchStart={onStopwatchStart}
                formatTime={formatTime}
                isSetCompleted={(exerciseId, setIndex) =>
                  completedSets[exerciseId]?.[setIndex] ?? false
                }
                onSetComplete={onSetComplete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setExercises((prevExercises) => {
        const oldIndex = prevExercises.findIndex(
          (exercise) => exercise.id === active.id,
        );
        const newIndex = prevExercises.findIndex(
          (exercise) => exercise.id === over.id,
        );

        return arrayMove(prevExercises, oldIndex, newIndex);
      });
    }
  }
};
