import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ERROR_MESSAGE } from '@/constants/message';
import { useMakers } from '@/hooks/use-maker';
import { useVehicles } from '@/hooks/use-vehicle';
import logger from '@/services/logger';
import { toast } from '@/components/common/toast/toast';
import { renderWithQuery } from '@/utils/test-utils/render-with-query';

import Dashboard from '@/pages/dashboard';

jest.mock('@/hooks/use-vehicle');
jest.mock('@/hooks/use-maker');

jest.mock('@/services/http-client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock('@/components/log-status-modal', () => () => null);

const mockUseVehicles = useVehicles as jest.Mock;
const mockUseMakers = useMakers as jest.Mock;

const mockMakersData = [
  {
    id: '1',
    name: 'Toyota',
    models: ['Camry', 'Corolla'],
  },
  {
    id: '2',
    name: 'Honda',
    models: ['Civic', 'Accord'],
  },
];

const mockVehiclesData = {
  pages: 3,
  data: [
    {
      id: 'veh-1',
      vin: 'VIN123456789',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      inventoryDate: '2026-08-01',
      price: 25000,
      status: null,
      note: null,
    },
    {
      id: 'veh-2',
      vin: 'VIN987654321',
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      inventoryDate: '2026-01-01',
      price: 22000,
      status: null,
      note: null,
    },
  ],
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(logger, 'error').mockImplementation(() => {});
    jest.spyOn(toast, 'add').mockImplementation();

    mockUseMakers.mockReturnValue({
      data: mockMakersData,
      isLoading: false,
      error: null,
    });

    mockUseVehicles.mockReturnValue({
      data: mockVehiclesData,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading skeletons when fetching initial data', () => {
    mockUseMakers.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    mockUseVehicles.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithQuery(<Dashboard />);

    expect(screen.getByText('Inventory Dashboard')).toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: /loading vehicles/i }),
    ).toBeInTheDocument();
  });

  it('renders filters, header, rows, and pagination when data is loaded', () => {
    renderWithQuery(<Dashboard />);

    expect(screen.getByText('Inventory Dashboard')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Vehicle (VIN)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Make' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Model' }),
    ).toBeInTheDocument();

    // Check rendered vehicles
    expect(screen.getByText('VIN123456789')).toBeInTheDocument();
    expect(screen.getByText('VIN987654321')).toBeInTheDocument();

    // Check pagination
    expect(
      screen.getByRole('navigation', { name: /pagination/i }),
    ).toBeInTheDocument();
  });

  it('renders empty state when no vehicles are found', () => {
    mockUseVehicles.mockReturnValue({
      data: { pages: 1, data: [] },
      isLoading: false,
      error: null,
    });

    renderWithQuery(<Dashboard />);

    expect(screen.getByText('No vehicles found.')).toBeInTheDocument();
  });

  it('updates filters and calls useVehicles with selected maker and model', async () => {
    const user = userEvent.setup();

    renderWithQuery(<Dashboard />);

    const [makerSelect] = screen.getAllByRole('combobox');

    // Select 'Toyota' as maker
    await user.click(makerSelect);
    const toyotaOption = await screen.findByRole('option', { name: 'Toyota' });
    await user.click(toyotaOption);

    expect(mockUseVehicles).toHaveBeenCalledWith({
      make: 'Toyota',
      model: undefined,
      page: 1,
      limit: expect.any(Number),
    });

    // Select 'Camry' as model
    const [, modelSelect] = screen.getAllByRole('combobox');
    await user.click(modelSelect);
    const camryOption = await screen.findByRole('option', { name: 'Camry' });
    await user.click(camryOption);

    expect(mockUseVehicles).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Camry',
      page: 1,
      limit: expect.any(Number),
    });
  });

  it('resets filters and page when clicking Clear Filters', async () => {
    const user = userEvent.setup();

    renderWithQuery(<Dashboard />);

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(mockUseVehicles).toHaveBeenLastCalledWith({
      make: undefined,
      model: undefined,
      page: 1,
      limit: expect.any(Number),
    });
  });

  it('changes page when a pagination link is clicked', async () => {
    const user = userEvent.setup();

    renderWithQuery(<Dashboard />);

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(mockUseVehicles).toHaveBeenLastCalledWith({
      make: undefined,
      model: undefined,
      page: 2,
      limit: expect.any(Number),
    });
  });

  it('logs error and shows toast when vehicles fetch fails', () => {
    const mockError = new Error('Failed to fetch vehicles');
    mockUseVehicles.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    renderWithQuery(<Dashboard />);

    expect(logger.error).toHaveBeenCalledWith(
      ERROR_MESSAGE.FAILED_TO_FETCH_VEHICLES,
      { error: mockError },
    );
    expect(toast.add).toHaveBeenCalledWith({
      type: 'error',
      description: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
    });
  });

  it('logs error and shows toast when makers fetch fails', () => {
    const mockMakersError = new Error('Failed to fetch makers');
    mockUseMakers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockMakersError,
    });

    renderWithQuery(<Dashboard />);

    expect(logger.error).toHaveBeenCalledWith(
      ERROR_MESSAGE.FAILED_TO_FETCH_MAKERS,
      { error: mockMakersError },
    );
    expect(toast.add).toHaveBeenCalledWith({
      type: 'error',
      description: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
    });
  });
});
