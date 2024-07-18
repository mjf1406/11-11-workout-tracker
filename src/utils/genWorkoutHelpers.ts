import type { Exercise, RoutineSettings, Routine } from "~/server/db/types";

export function generateRoutine(settings: RoutineSettings, exercises: Exercise[]): Routine {
    const routine: Routine = {
      upperPull: [],
      upperPush: [],
      lower: [],
      abs: [],
    };
  
    routine.upperPull = selectNRandomElements(
      exercises.filter(e => e.BODY_PART === 'upper' && e.TYPE === 'pull'),
      settings.upperPull
    );
  
    routine.upperPush = selectNRandomElements(
      exercises.filter(e => e.BODY_PART === 'upper' && e.TYPE === 'push'),
      settings.upperPush
    );
  
    routine.lower = selectNRandomElements(
      exercises.filter(e => e.BODY_PART === 'lower'),
      settings.lower
    );
  
    routine.abs = selectNRandomElements(
      exercises.filter(e => e.BODY_PART === 'abs'),
      settings.abs
    );
  
    return routine;
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

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }