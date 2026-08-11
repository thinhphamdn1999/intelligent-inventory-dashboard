import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-key';
import { ENDPOINT } from '@/constants/endpoint';

import type { Maker } from '@/types/maker';

import { useMakers } from '@/hooks/use-maker';

import { createTestQueryClient } from '@/utils/test-utils/render-with-query';

import httpClient from '@/services/http-client';

jest.mock('@/services/http-client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockMakers: Maker[] = [
  {
    id: 'a1f2c3d4-1e2f-4a5b-8c6d-7e8f9a0b1c2d',
    name: 'Toyota',
    models: ['Camry', 'Corolla'],
  },
  {
    id: 'b2g3h4i5-2f3g-5b6c-9d7e-8f9g0h1i2j3k',
    name: 'Honda',
    models: ['Civic', 'Accord'],
  },
];

function createWrapper() {
  const queryClient = createTestQueryClient();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
}

describe('useMakers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the makers endpoint and returns the data', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue(mockMakers);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useMakers(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(httpClient.get).toHaveBeenCalledWith(ENDPOINT.GET_LIST_MAKERS);
    expect(result.current.data).toEqual(mockMakers);
  });

  it('uses the correct query key', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue(mockMakers);
    const { wrapper, queryClient } = createWrapper();

    renderHook(() => useMakers(), { wrapper });

    await waitFor(() => {
      const cached = queryClient.getQueryData([QUERY_KEYS.MAKERS]);
      expect(cached).toEqual(mockMakers);
    });
  });

  it('exposes an error state when the request fails', async () => {
    (httpClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useMakers(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('shows a loading state before the request resolves', () => {
    (httpClient.get as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useMakers(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });
});
