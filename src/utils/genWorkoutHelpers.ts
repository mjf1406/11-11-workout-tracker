/* eslint-disable @typescript-eslint/prefer-for-of */
import { getPreviousExerciseSetDataById, setExerciseUsedById } from "~/app/exercises/actions";
import type { SettingsDb, Routine, ExerciseDb, Workout, RoutineClient, ExerciseRoutine } from "~/server/db/types";

export async function generateRoutine(settings: SettingsDb, exercises: ExerciseDb[]): Promise<Routine> {
    const routine: Routine = {
      upper_pull: [],
      upper_push: [],
      lower: [],
      abs: [],
    };
  
    let upperPull = exercises.filter(e => e.body_part === 'upper' && e.type === 'pull')
    let upperPush = exercises.filter(e => e.body_part === 'upper' && e.type === 'push')
    let lower = exercises.filter(e => e.body_part === 'lower')
    let abs = exercises.filter(e => e.body_part === 'abs')

    upperPull = await handleUsedCheck(upperPull, "upper_pull", settings)
    upperPush = await handleUsedCheck(upperPush, "upper_push", settings)
    lower = await handleUsedCheck(lower, "lower", settings)
    abs = await handleUsedCheck(abs, "abs", settings)

    upperPull = upperPull.filter(e => e.used === false)
    upperPush = upperPush.filter(e => e.used === false)
    lower = lower.filter(e => e.used === false)
    abs = abs.filter(e => e.used === false)

    routine.upper_pull = selectNRandomElements(
      upperPull,
      settings.upper_pull
    );
  
    routine.upper_push = selectNRandomElements(
      upperPush,
      settings.upper_push
    );
  
    routine.lower = selectNRandomElements(
      lower,
      settings.lower
    );
  
    routine.abs = selectNRandomElements(
      abs,
      settings.abs
    );
  
    for (const category in routine) {
      if (routine.hasOwnProperty(category)) {
        for (const exercise of routine[category as keyof Routine]) {
          const id = exercise.id
          if (!id) continue
          const exerciseData: Workout[] = await getPreviousExerciseSetDataById(id);
          const dataZero = exerciseData[0]?.exercises
          const data = dataZero?.find(e => e.id === id)
          const sets = data?.sets[0]
          const routineExercises = routine[category as keyof Routine]
          const routineExerciseIndex = routineExercises.findIndex(e => e.id === exercise.id)
          if (!routine[category as keyof Routine] || routineExerciseIndex === -1) continue;
          const exerciseArray = routine[category as keyof Routine];
          if (Array.isArray(exerciseArray) && routineExerciseIndex in exerciseArray) {
            const currentExercise = exerciseArray[routineExerciseIndex];
            if (currentExercise) {
              (currentExercise as ExerciseRoutine).previous_weight = sets?.weight;
              (currentExercise as ExerciseRoutine).previous_reps = sets?.reps;
            }
          }
        }
      }
    }

    return routine as RoutineClient;
}

type ExerciseCategory = 'upper_pull' | 'upper_push' | 'lower' | 'abs';

function getCategoryMinimum(settings: SettingsDb, category: ExerciseCategory): number {
  switch (category) {
    case 'upper_pull':
      return settings.upper_pull;
    case 'upper_push':
      return settings.upper_push;
    case 'lower':
      return settings.lower;
    case 'abs':
      return settings.abs;
    default:
      const _exhaustiveCheck: never = category;
      return _exhaustiveCheck;
  }
}

async function handleUsedCheck(
  exercises: ExerciseDb[], 
  category: ExerciseCategory, 
  settings: SettingsDb
): Promise<ExerciseDb[]> {
  const minimumRequired = getCategoryMinimum(settings, category);
  
  if (isInsufficientUsed(exercises, minimumRequired)) {
    for (const exercise of exercises) {
      if (!exercise) continue
      await setExerciseUsedById(exercise.id!, false)
    }
    return setAllUnUsed(exercises);
  }
  return exercises;
}

function isInsufficientUsed(exercises: ExerciseDb[], minimum: number): boolean {
  const usedExercises = exercises.filter(exercise => exercise.used === false);
  return usedExercises.length < minimum;
}

function setAllUnUsed(exercises: ExerciseDb[]): ExerciseDb[] {
  return exercises.map(exercise => ({
    ...exercise,
    used: false
  }));
}

function selectNRandomElements<T>(array: T[], N: number): T[] {
    if (!array || array.length === 0 || N <= 0) {
        return [];
    }
    N = Math.min(N, array.length);
    return [...array].sort(() => 0.5 - Math.random()).slice(0, N);
}

function getRandomElement<T>(arr: T[]): T | undefined {
    if (arr.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export async function shuffleArray<T>(array: T[]): Promise<T[]> {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] as [T, T];
  }
  return shuffled;
}