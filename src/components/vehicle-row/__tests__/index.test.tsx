import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DATE_FORMAT } from '@/constants/date';
import type { Vehicle } from '@/types/vehicle';
import { formatDate } from '@/utils/date';
import { renderWithQuery } from '@/utils/test-utils/render-with-query';

import VehicleRow from '@/components/vehicle-row';

jest.mock('@/components/log-status-modal', () => {
  return function MockLogStatusModal({
    vehicle,
    open,
    onOpenChange,
  }: {
    vehicle: Vehicle;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    if (!open) return null;

    return (
      <div data-testid="log-status-modal">
        <span>
          Log Status Modal for {vehicle.make} {vehicle.model}
        </span>
        <button onClick={() => onOpenChange(false)}>Close Modal</button>
      </div>
    );
  };
});

const recentVehicle: Vehicle = {
  id: 'veh-123',
  vin: '1HGCR2F83HA000000',
  make: 'Honda',
  model: 'Accord',
  year: 2023,
  inventoryDate: '2026-08-01', // 10 days ago relative to fixed timer
  price: 25000,
  status: null,
  note: null,
};

const agingVehicle: Vehicle = {
  ...recentVehicle,
  inventoryDate: '2026-01-01', // Over 90 days ago relative to fixed timer
};

describe('VehicleRow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-11T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders non-aging vehicle row details correctly', () => {
    renderWithQuery(<VehicleRow vehicle={recentVehicle} />);

    const expectedDateString = formatDate(
      recentVehicle.inventoryDate,
      DATE_FORMAT.PRIMARY,
    );

    expect(screen.getByRole('row')).toBeInTheDocument();
    expect(screen.getByText(recentVehicle.vin)).toBeInTheDocument();
    expect(screen.getByText(recentVehicle.make)).toBeInTheDocument();
    expect(screen.getByText(recentVehicle.model)).toBeInTheDocument();
    expect(screen.getByText(expectedDateString)).toBeInTheDocument();

    expect(screen.getByText('In stock')).toBeInTheDocument();
    expect(screen.getByText('No action needed')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /log status/i }),
    ).not.toBeInTheDocument();
  });

  it('renders aging vehicle row with badge and log status button', () => {
    renderWithQuery(<VehicleRow vehicle={agingVehicle} />);

    expect(screen.getByText('Aging stock')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /log status/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText('No action needed')).not.toBeInTheDocument();
  });

  it('opens LogStatusModal when clicking "Log status" and closes it on demand', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithQuery(<VehicleRow vehicle={agingVehicle} />);

    // Verify modal is not in DOM initially
    expect(screen.queryByTestId('log-status-modal')).not.toBeInTheDocument();

    // Click "Log status" to open modal
    await user.click(screen.getByRole('button', { name: /log status/i }));

    expect(screen.getByTestId('log-status-modal')).toBeInTheDocument();
    expect(
      screen.getByText(
        `Log Status Modal for ${agingVehicle.make} ${agingVehicle.model}`,
      ),
    ).toBeInTheDocument();

    // Trigger modal close callback
    await user.click(screen.getByRole('button', { name: /close modal/i }));

    expect(screen.queryByTestId('log-status-modal')).not.toBeInTheDocument();
  });
});
