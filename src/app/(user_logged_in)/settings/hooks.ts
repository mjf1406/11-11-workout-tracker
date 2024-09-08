import { useQuery, useSuspenseQuery, type UseSuspenseQueryResult } from '@tanstack/react-query';
import { fetchSettings } from '~/app/api/fetchers';
import type { SettingsResponse } from '~/server/db/types';

export const useSettings = (): UseSuspenseQueryResult<SettingsResponse, Error> => {
  return useSuspenseQuery<SettingsResponse, Error>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });
};