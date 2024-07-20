// Database
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
    created_date: string | undefined,
    updated_date: string | undefined,
}
// Other stuff
export type RoutineSettings = {
    upperPush: number,
    upperPull: number,
    lower: number,
    abs: number,
    sets: number,
    restDuration: number,
}

export type Exercise = {
    ID: number,
    NAME: string,
    VARIANT: string,
    BODY_PART: string,
    TYPE: string,
}

export type Routine = {
    upperPull: Exercise[],
    upperPush: Exercise[],
    lower: Exercise[],
    abs: Exercise[],
}