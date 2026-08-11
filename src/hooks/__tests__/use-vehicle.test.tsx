import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import type { VehicleListResponse } from '@/types/vehicle';

import { QUERY_KEYS } from '@/constants/query-key';
import { ENDPOINT } from '@/constants/endpoint';
import { MESSAGE, ERROR_MESSAGE } from '@/constants/message';

import { toast } from '@/components/common/toast/toast';

import { useVehicles, useLogVehicleStatus } from '@/hooks/use-vehicle';

import httpClient from '@/services/http-client';
import logger from '@/services/logger';

import { createTestQueryClient } from '@/utils/test-utils/render-with-query';

jest.mock('@/services/http-client', () => ({
  __esModule: true,
  default: { get: jest.fn(), patch: jest.fn() },
}));

jest.mock('@/services/logger', () => ({
  __esModule: true,
  default: { info: jest.fn(), error: jest.fn() },
}));

jest.mock('@/components/common/toast/toast', () => ({
  toast: { add: jest.fn() },
}));

function createWrapper() {
  const queryClient = createTestQueryClient();
  const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, invalidateSpy };
}

const mockResponse: VehicleListResponse = {
  first: 1,
  prev: null,
  next: null,
  last: 1,
  pages: 1,
  items: 1,
  data: [
    {
      id: '1',
      vin: 'ABC123',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      inventoryDate: '2026-07-01',
      price: 28000,
      status: null,
      note: null,
    },
  ],
};

describe('useVehicles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the vehicles endpoint with mapped query params', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useVehicles({ make: 'Toyota', model: 'Camry', page: 2, limit: 10 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(httpClient.get).toHaveBeenCalledWith(ENDPOINT.GET_LIST_VEHICLES, {
      make: 'Toyota',
      model: 'Camry',
      _page: 2,
      _per_page: 10,
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('passes undefined filters through without sending empty strings', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);
    const { wrapper } = createWrapper();

    renderHook(() => useVehicles({}), { wrapper });

    await waitFor(() =>
      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINT.GET_LIST_VEHICLES, {
        make: undefined,
        model: undefined,
        _page: undefined,
        _per_page: undefined,
      }),
    );
  });

  it('exposes an error state when the request fails', async () => {
    (httpClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useVehicles(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useLogVehicleStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the patch endpoint with status and note', async () => {
    (httpClient.patch as jest.Mock).mockResolvedValue({});
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useLogVehicleStatus(), { wrapper });

    result.current.mutate({
      id: 'veh-1',
      status: 'Price reduction planned',
      note: 'test note',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(httpClient.patch).toHaveBeenCalledWith(
      ENDPOINT.PATCH_VEHICLE('veh-1'),
      {
        status: 'Price reduction planned',
        note: 'test note',
      },
    );
  });

  it('invalidates the vehicles query and shows a success toast on success', async () => {
    (httpClient.patch as jest.Mock).mockResolvedValue({});
    const { wrapper, invalidateSpy } = createWrapper();

    const { result } = renderHook(() => useLogVehicleStatus(), { wrapper });

    result.current.mutate({
      id: 'veh-1',
      status: 'Price reduction planned',
      note: '',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: [QUERY_KEYS.VEHICLES],
    });
    expect(logger.info).toHaveBeenCalledWith(
      MESSAGE.STATUS_UPDATED_SUCCESSFULLY,
      {
        vehicleId: 'veh-1',
        status: 'Price reduction planned',
      },
    );
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      description: MESSAGE.STATUS_UPDATED_SUCCESSFULLY,
    });
  });

  it('logs and shows an error toast when the mutation fails', async () => {
    const mockError = new Error('Request failed');
    (httpClient.patch as jest.Mock).mockRejectedValue(mockError);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useLogVehicleStatus(), { wrapper });

    result.current.mutate({
      id: 'veh-1',
      status: 'Price reduction planned',
      note: '',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(logger.error).toHaveBeenCalledWith(
      ERROR_MESSAGE.FAILED_TO_UPDATE_VEHICLE_STATUS,
      {
        vehicleId: 'veh-1',
        error: mockError,
      },
    );
    expect(toast.add).toHaveBeenCalledWith({
      type: 'error',
      description: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
    });
  });
});
