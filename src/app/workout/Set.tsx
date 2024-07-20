import React, { useState, useEffect } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

interface SetProps {
  exerciseId: number | undefined;
  setNumber: number;
  previousWeight?: number;
  previousReps?: number;
  onUpdate: (weight: number, reps: number) => void;
}

export default function Set({
  exerciseId,
  setNumber,
  previousWeight,
  previousReps,
  onUpdate,
}: SetProps) {
  const [weight, setWeight] = useState<number | undefined>(previousWeight);
  const [reps, setReps] = useState<number | undefined>(previousReps);

  useEffect(() => {
    if (weight !== undefined && reps !== undefined) {
      onUpdate(weight, reps);
    }
  }, [weight, reps, onUpdate]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight =
      e.target.value === "" ? undefined : Number(e.target.value);
    setWeight(newWeight);
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReps = e.target.value === "" ? undefined : Number(e.target.value);
    setReps(newReps);
  };

  return (
    <div className="mb-2 grid grid-cols-7 items-center justify-center space-x-2 text-sm">
      <div className="col-span-1 text-center">{setNumber}</div>
      <div className="col-span-1 text-center">
        {previousWeight && previousReps
          ? `${previousWeight}kg x ${previousReps}`
          : "N/A"}
      </div>
      <div className="col-span-2 text-center">
        <Input
          value={weight ?? ""}
          onChange={handleWeightChange}
          type="number"
          min="0"
          step="0.5"
          placeholder={previousWeight ? previousWeight.toString() : "Weight"}
        />
      </div>
      <div className="col-span-2 text-center">
        <Input
          value={reps ?? ""}
          onChange={handleRepsChange}
          type="number"
          min="0"
          step="1"
          placeholder={previousReps ? previousReps.toString() : "Reps"}
        />
      </div>
      <div className="col-span-1 text-center">
        <Checkbox className="h-8 w-8" />
      </div>
    </div>
  );
}
