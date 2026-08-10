import { useQuery } from '@tanstack/react-query';

import type { VehicleFilters, VehicleListResponse } from '@/types/vehicle';

import httpClient from '@/services/http-client';

export const useVehicles = (filters: VehicleFilters = {}) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () =>
      httpClient.get<VehicleListResponse>('/vehicles', {
        make: filters.make,
        model: filters.model,
        _page: filters.page,
        _per_page: filters.limit,
      }),
  });
};
