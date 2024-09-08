import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchWorkouts } from '~/app/api/fetchers';
import type { WorkoutsResponse } from '~/server/db/types';

export const useWorkouts = (): UseQueryResult<WorkoutsResponse, Error> => {
  return useQuery<WorkoutsResponse, Error>({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
  });
};

