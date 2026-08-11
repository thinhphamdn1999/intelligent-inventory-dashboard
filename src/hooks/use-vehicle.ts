import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-key';
import { ERROR_MESSAGE, MESSAGE } from '@/constants/message';
import { ENDPOINT } from '@/constants/endpoint';

import type {
  LogVehicleStatusInput,
  VehicleFilters,
  VehicleListResponse,
} from '@/types/vehicle';

import { toast } from '@/components/common/toast/toast';

import httpClient from '@/services/http-client';
import logger from '@/services/logger';

export const useVehicles = (filters: VehicleFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VEHICLES, filters],
    queryFn: () =>
      httpClient.get<VehicleListResponse>(ENDPOINT.GET_LIST_VEHICLES, {
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
      return httpClient.patch(ENDPOINT.PATCH_VEHICLE(data.id), {
        status: data.status,
        note: data.note,
      });
    },
    onSuccess: (_, variables) => {
      logger.info(MESSAGE.STATUS_UPDATED_SUCCESSFULLY, {
        vehicleId: variables.id,
        status: variables.status,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
      toast.add({
        type: 'success',
        description: MESSAGE.STATUS_UPDATED_SUCCESSFULLY,
      });
    },
    onError: (error, variables) => {
      logger.error(ERROR_MESSAGE.FAILED_TO_UPDATE_VEHICLE_STATUS, {
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
