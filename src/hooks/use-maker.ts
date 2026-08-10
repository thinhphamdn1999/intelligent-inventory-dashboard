import { useQuery } from '@tanstack/react-query';

import type { Maker } from '@/types/maker';

import httpClient from '@/services/http-client';

export const useMakers = () => {
  return useQuery({
    queryKey: ['makers'],
    queryFn: () => httpClient.get<Maker[]>('/makers'),
  });
};
