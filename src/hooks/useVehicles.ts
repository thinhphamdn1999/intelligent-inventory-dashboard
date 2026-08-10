import { useQuery } from '@tanstack/react-query';

import type { Vehicle } from '@/types/vehicle';

import httpClient from '@/services/http-client';

export interface VehicleFilters {
  make?: string;
  model?: string;
  page?: number;
  limit?: number;
}

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () =>
      httpClient.get<Vehicle[]>('/vehicles', {
        make: filters.make,
        model: filters.model,
        _page: filters.page,
        _limit: filters.limit,
      }),
  });
}
