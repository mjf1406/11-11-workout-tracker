import type { 
    ExercisesResponse, 
    WorkoutsResponse, 
    SettingsResponse 
} from '~/server/db/types';

export const fetchExercises = async (): Promise<ExercisesResponse> => {
  const response = await fetch('/api/exercises');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json() as ExercisesResponse;
};

export const fetchWorkouts = async (): Promise<WorkoutsResponse> => {
  const response = await fetch('/api/workouts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json() as WorkoutsResponse;
};

export const fetchSettings = async (): Promise<SettingsResponse> => {
  const response = await fetch('/api/settings');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json() as SettingsResponse;
};