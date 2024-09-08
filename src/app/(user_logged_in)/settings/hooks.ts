import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchSettings } from '~/app/api/fetchers';
import type { SettingsResponse } from '~/server/db/types';

export const useSettings = (): UseQueryResult<SettingsResponse, Error> => {
  return useQuery<SettingsResponse, Error>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });
};