import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchExercises } from '~/app/api/fetchers';
import type { ExercisesResponse } from '~/server/db/types';

export const useExercises = () : UseQueryResult<ExercisesResponse, Error> => {
  return useQuery<ExercisesResponse, Error>({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
  });
};