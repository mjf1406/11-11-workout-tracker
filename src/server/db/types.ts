// Database
export type SettingsDb = {
    user_id: string,
    upper_pull: number,
    upper_push: number,
    lower: number,
    abs: number,
    sets: number,
    rest_duration: number,
    created_date: string | undefined,
    updated_date: string | undefined,
}
export type UserDb = {
    user_id: string;
    user_name: string;
    user_email: string;
    user_role: "user" | "admin",
    joined_date: string | undefined;
    updated_date: string | undefined;
}
export type ExerciseDb = {
    id: number | undefined,
    user_id: string,
    name: string,
    variant: string,
    body_part: string,
    type: string,
    used: boolean,
    created_date: string | undefined,
    updated_date: string | undefined,
}
export type Workout = {
    id: number | undefined,
    user_id: string,
    exercises: Exercise[],
    created_date: string | undefined,
    updated_date: string | undefined,
}
export type Exercise = {
    id: number, // same id as in ExerciseDb
    sets: Set[],
}
export type Set = {
    weight: number,
    reps: number,
}
// Other stuff
export type Routine = {
    upper_pull: ExerciseDb[],
    upper_push: ExerciseDb[],
    lower: ExerciseDb[],
    abs: ExerciseDb[],
}