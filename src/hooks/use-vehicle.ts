import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  LogVehicleStatusInput,
  VehicleFilters,
  VehicleListResponse,
} from '@/types/vehicle';

import httpClient from '@/services/http-client';
import { toast } from '@/components/common/toast/toast';
import { ERROR_MESSAGE } from '@/constants/error-message';
import { logger } from '@/services/logger';

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

export const useLogVehicleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LogVehicleStatusInput) => {
      return httpClient.patch(`/vehicles/${data.id}`, {
        status: data.status,
        note: data.note,
      });
    },
    onSuccess: (_, variables) => {
      logger.info('Vehicle status updated', {
        vehicleId: variables.id,
        status: variables.status,
      });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.add({
        type: 'success',
        description: 'Status updated successfully',
      });
    },
    onError: (error, variables) => {
      logger.error('Failed to update vehicle status', {
        vehicleId: variables.id,
        error,
      });
      toast.add({
        type: 'error',
        description: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
      });
    },
  });
};
