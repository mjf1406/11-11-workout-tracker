import type { SettingsDb, Routine, ExerciseDb } from "~/server/db/types";

export function generateRoutine(settings: SettingsDb, exercises: ExerciseDb[]): Routine {
    const routine: Routine = {
      upper_pull: [],
      upper_push: [],
      lower: [],
      abs: [],
    };
  
    routine.upper_pull = selectNRandomElements(
      exercises.filter(e => e.body_part === 'upper' && e.type === 'pull'),
      settings.upper_pull
    );
  
    routine.upper_push = selectNRandomElements(
      exercises.filter(e => e.body_part === 'upper' && e.type === 'push'),
      settings.upper_push
    );
  
    routine.lower = selectNRandomElements(
      exercises.filter(e => e.body_part === 'lower'),
      settings.lower
    );
  
    routine.abs = selectNRandomElements(
      exercises.filter(e => e.body_part === 'abs'),
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

export async function shuffleArray<T>(array: T[]): Promise<T[]> {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] as [T, T];
  }
  return shuffled;
}