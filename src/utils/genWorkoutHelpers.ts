/* eslint-disable @typescript-eslint/prefer-for-of */
import { getPreviousExerciseSetDataById, setExerciseUsedById } from "~/app/exercises/actions";
import type { SettingsDb, Routine, ExerciseDb, Workout, RoutineClient, ExerciseRoutine, DayOfWeek } from "~/server/db/types";

type BodyPart = 'upper' | 'lower' | 'abs';
type ExerciseType = 'push' | 'pull' | '-';

interface FilterCriteria {
  bodyPart: BodyPart;
  type?: ExerciseType;
  forcedDaysOnly?: boolean;
  forcedDay?: DayOfWeek;
}

const filterExercises = (
  exercises: ExerciseDb[], 
  criteria: FilterCriteria
): ExerciseDb[] => {
  return exercises.filter(exercise => {
    const bodyPartMatch = exercise.body_part === criteria.bodyPart;
    const typeMatch = !criteria.type || exercise.type === criteria.type;
    
    let forcedDaysMatch = true;
    if (criteria.forcedDaysOnly !== undefined || criteria.forcedDay) {
      const forcedDays = exercise.forced_days;
      
      if (criteria.forcedDay) {
        forcedDaysMatch = forcedDays[criteria.forcedDay];
      } else if (criteria.forcedDaysOnly !== undefined) {
        const hasForcedDays = Object.values(forcedDays).some(day => day === true);
        forcedDaysMatch = criteria.forcedDaysOnly ? hasForcedDays : !hasForcedDays;
      }
    }

    return bodyPartMatch && typeMatch && forcedDaysMatch;
  });
};

const getCurrentDayOfWeek = (): DayOfWeek => {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDay = new Date().getDay();
  return days[currentDay]!;
};

export async function generateRoutine(settings: SettingsDb, exercises: ExerciseDb[]): Promise<RoutineClient> {

  const currentDay: DayOfWeek = getCurrentDayOfWeek();

  const routine: Routine = {
    upper_pull: [],
    upper_push: [],
    lower: [],
    abs: [],
  };

  const upperPullForced = filterExercises(exercises, { bodyPart: 'upper', type: 'pull', forcedDay: currentDay})
  const upperPushForced = filterExercises(exercises, { bodyPart: 'upper', type: 'push', forcedDay: currentDay})
  const lowerForced = filterExercises(exercises, { bodyPart: 'lower', forcedDay: currentDay})
  const absForced = filterExercises(exercises, { bodyPart: 'abs', forcedDay: currentDay})

  let upperPull = filterExercises(exercises, { bodyPart: 'upper', forcedDaysOnly: false, type: 'pull' });
  let upperPush = filterExercises(exercises, { bodyPart: 'upper', forcedDaysOnly: false, type: 'push' });
  let lower = filterExercises(exercises, { bodyPart: 'lower', forcedDaysOnly: false });
  let abs = filterExercises(exercises, { bodyPart: 'abs', forcedDaysOnly: false });

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

  routine.upper_pull = [...routine.upper_pull, ...upperPullForced];
  routine.upper_push = [...routine.upper_push, ...upperPushForced];
  routine.lower = [...routine.lower, ...lowerForced];
  routine.abs = [...routine.abs, ...absForced];

  for (const category in routine) {
    if (routine.hasOwnProperty(category)) {
      for (const exercise of routine[category as keyof Routine]) {
        const id = exercise.id
        if (!id) continue
        const exerciseData: Workout[] = await getPreviousExerciseSetDataById(id);
        const dataZero = exerciseData[0]?.exercises
        const data = dataZero?.find(e => e.id === id)
        // const sets = data?.sets[0]
        const sets = data?.sets
        const routineExercises = routine[category as keyof Routine]
        const routineExerciseIndex = routineExercises.findIndex(e => e.id === exercise.id)
        if (!routine[category as keyof Routine] || routineExerciseIndex === -1) continue;
        const exerciseArray = routine[category as keyof Routine];
        if (Array.isArray(exerciseArray) && routineExerciseIndex in exerciseArray) {
          const currentExercise = exerciseArray[routineExerciseIndex];
          if (currentExercise) {
            if (sets) {
              // (currentExercise as ExerciseRoutine).previous_weight = sets[0].weight;
              // (currentExercise as ExerciseRoutine).previous_reps = sets[0].reps;
              (currentExercise as ExerciseRoutine).sets = sets;
            }
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