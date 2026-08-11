import { useQuery } from '@tanstack/react-query';

import type { Maker } from '@/types/maker';

import { ENDPOINT } from '@/constants/endpoint';
import { QUERY_KEYS } from '@/constants/query-key';

import httpClient from '@/services/http-client';

export const useMakers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MAKERS],
    queryFn: () => httpClient.get<Maker[]>(ENDPOINT.GET_LIST_MAKERS),
  });
};
