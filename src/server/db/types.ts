
export type Days = ( 1 | 2 | 3 | 4 | 5 | 6 | 7 )[];
export type FormattedDays = ( "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" )[];

export type User = {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: "user" | "admin";
  joined_date?: string;
  updated_date?: string;
};


export type Exercise = {
  id: number;
  user_id?: string;
  name: string;
  variant?: string;
  body_part: string;
  type?: string;
  used?: boolean;
  unit: "reps" | "stopwatch";
  forced_days?: Days;
  formatted_days?: FormattedDays;
  created_date?: string;
  updated_date?: string;
}

export type ExerciseWorkout = {
  id: number;
  sets: { weight: number; reps: number }[];
}

export type FilteredWorkoutData = {
  exercises: ExerciseWorkout[];
}

export interface Workout {
  id?: number;
  user_id: string;
  exercises: Exercise[];
  created_date?: string;
  updated_date?: string;
}

export interface Settings {
  user_id: string;
  upper_pull: number;
  upper_push: number;
  lower: number;
  abs: number;
  sets: number;
  rest_duration: number;
  created_date?: string;
  updated_date?: string;
}

export type ExercisesResponse = Exercise[];
export type WorkoutsResponse = Workout[];
export type SettingsResponse = Settings;