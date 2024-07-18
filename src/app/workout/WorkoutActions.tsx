import CancelWorkout from "./CancelWorkout";
import FinishWorkout from "./FinishWorkout";

export default function WorkoutActions() {
  return (
    <div className="flex gap-5">
      <CancelWorkout />
      <FinishWorkout />
    </div>
  );
}
