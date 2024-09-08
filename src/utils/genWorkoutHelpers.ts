import type {
  Days,
  Exercise,
  Settings,
} from "~/server/db/types";

type BodyPart = 'upper' | 'lower' | 'abs';
type ExerciseType = 'push' | 'pull' | '-';
type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

interface FilterCriteria {
  bodyPart: BodyPart;
  type?: ExerciseType;
  forcedDaysOnly?: boolean;
  forcedDay?: DayOfWeek;
}


const filterExercises = (
  exercises: Exercise[], 
  criteria: FilterCriteria
): Exercise[] => {
  return exercises.filter(exercise => {
    const bodyPartMatch = exercise.body_part === criteria.bodyPart;
    const typeMatch = !criteria.type || exercise.type === criteria.type;
    
    let forcedDaysMatch = true;
    if (criteria.forcedDaysOnly !== undefined || criteria.forcedDay) {
      const forcedDays = exercise.forced_days;
      
      if (criteria.forcedDay && forcedDays) {
        const dayNumber = getDayNumber(criteria.forcedDay);
        forcedDaysMatch = Array.isArray(forcedDays)
          ? forcedDays.includes(dayNumber as Days[number])
          : forcedDays === dayNumber;
      } else if (criteria.forcedDaysOnly !== undefined) {
        const hasForcedDays = forcedDays && (Array.isArray(forcedDays) ? forcedDays.length > 0 : forcedDays > 0);
        forcedDaysMatch = criteria.forcedDaysOnly ? !!hasForcedDays : !hasForcedDays;
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

const getDayNumber = (day: DayOfWeek): number => {
  const dayMap: Record<DayOfWeek, number> = {
    'sun': 1, 'mon': 2, 'tue': 3, 'wed': 4, 'thu': 5, 'fri': 6, 'sat': 7
  };
  return dayMap[day];
};

export async function generateRoutine(settings: Settings, exercises: Exercise[]): Promise<Exercise[]> {
  const currentDay = getCurrentDayOfWeek();

  const upperPullForced = filterExercises(exercises, { bodyPart: 'upper', type: 'pull', forcedDay: currentDay });
  const upperPushForced = filterExercises(exercises, { bodyPart: 'upper', type: 'push', forcedDay: currentDay });
  const lowerForced = filterExercises(exercises, { bodyPart: 'lower', forcedDay: currentDay });
  const absForced = filterExercises(exercises, { bodyPart: 'abs', forcedDay: currentDay });

  let upperPull = filterExercises(exercises, { bodyPart: 'upper', forcedDaysOnly: false, type: 'pull' });
  let upperPush = filterExercises(exercises, { bodyPart: 'upper', forcedDaysOnly: false, type: 'push' });
  let lower = filterExercises(exercises, { bodyPart: 'lower', forcedDaysOnly: false });
  let abs = filterExercises(exercises, { bodyPart: 'abs', forcedDaysOnly: false });

  upperPull = await handleUsedCheck(upperPull, "upper_pull", settings);
  upperPush = await handleUsedCheck(upperPush, "upper_push", settings);
  lower = await handleUsedCheck(lower, "lower", settings);
  abs = await handleUsedCheck(abs, "abs", settings);

  upperPull = upperPull.filter(e => !e.used);
  upperPush = upperPush.filter(e => !e.used);
  lower = lower.filter(e => !e.used);
  abs = abs.filter(e => !e.used);

  const routine = [
    ...selectNRandomElements(upperPull, settings.upper_pull),
    ...selectNRandomElements(upperPush, settings.upper_push),
    ...selectNRandomElements(lower, settings.lower),
    ...selectNRandomElements(abs, settings.abs),
    ...upperPullForced,
    ...upperPushForced,
    ...lowerForced,
    ...absForced
  ];

  return shuffleArray(routine);
}

type ExerciseCategory = 'upper_pull' | 'upper_push' | 'lower' | 'abs';

function getCategoryMinimum(settings: Settings, category: ExerciseCategory): number {
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
  exercises: Exercise[], 
  category: ExerciseCategory, 
  settings: Settings
): Promise<Exercise[]> {
  const minimumRequired = getCategoryMinimum(settings, category);
  
  if (isInsufficientUsed(exercises, minimumRequired)) {
    exercises.forEach(exercise => {
      if (exercise) {
        exercise.used = false;
      }
    });
    return setAllUnUsed(exercises);
  }
  return exercises;
}

function isInsufficientUsed(exercises: Exercise[], minimum: number): boolean {
  const usedExercises = exercises.filter(exercise => !exercise.used);
  return usedExercises.length < minimum;
}

function setAllUnUsed(exercises: Exercise[]): Exercise[] {
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

export async function scrambleWord(word: string) {
  const wordArray = word.split('');
  const scrambled = shuffleArray(wordArray);
  return scrambled.join('');
}

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }
  return arr;
}