import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Vehicle } from '@/types/vehicle';

import LogStatusModal from '@/components/log-status-modal';

import httpClient from '@/services/http-client';
import { renderWithQuery } from '@/utils/test-utils/render-with-query';

jest.mock('@/services/http-client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockVehicle: Vehicle = {
  id: 'veh-123',
  vin: 'VIN123456789',
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  inventoryDate: '2026-01-01',
  price: 25000,
  status: 'Price reduction planned',
  note: 'Existing note',
};

describe('LogStatusModal', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when vehicle is null', () => {
    const { container } = renderWithQuery(
      <LogStatusModal
        vehicle={null}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal details and initial values when open', () => {
    renderWithQuery(
      <LogStatusModal
        vehicle={mockVehicle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    expect(
      screen.getByText(`Log status — ${mockVehicle.make} ${mockVehicle.model}`),
    ).toBeInTheDocument();
    expect(screen.getByText(mockVehicle.vin)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent(mockVehicle.status!);
    expect(screen.getByRole('textbox', { name: /note/i })).toHaveValue(
      mockVehicle.note,
    );
  });

  it('disables the save button when status is empty', () => {
    const vehicleWithNoStatus: Vehicle = {
      ...mockVehicle,
      status: null,
    };

    renderWithQuery(
      <LogStatusModal
        vehicle={vehicleWithNoStatus}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    expect(screen.getByRole('button', { name: /save status/i })).toBeDisabled();
  });

  it('updates form inputs when typed into or selected', async () => {
    const user = userEvent.setup();

    renderWithQuery(
      <LogStatusModal
        vehicle={{ ...mockVehicle, status: null, note: null }}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const textarea = screen.getByRole('textbox', { name: /note/i });

    // Open select dropdown and choose an option
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', {
      name: /price reduction planned/i,
    });
    await user.click(option);

    // Type note
    await user.type(textarea, 'New update note');

    expect(screen.getByRole('combobox')).toHaveTextContent(
      /price reduction planned/i,
    );
    expect(textarea).toHaveValue('New update note');
    expect(screen.getByRole('button', { name: /save status/i })).toBeEnabled();
  });

  it('submits status mutation and closes modal on success', async () => {
    const user = userEvent.setup();
    (httpClient.patch as jest.Mock).mockResolvedValue({});

    renderWithQuery(
      <LogStatusModal
        vehicle={mockVehicle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /save status/i }));

    expect(httpClient.patch).toHaveBeenCalledWith(
      expect.stringContaining('veh-123'),
      {
        status: mockVehicle.status,
        note: mockVehicle.note,
      },
    );

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('calls onOpenChange(false) when cancel button is clicked', async () => {
    const user = userEvent.setup();

    renderWithQuery(
      <LogStatusModal
        vehicle={mockVehicle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows saving state and prevents closing while pending', async () => {
    const user = userEvent.setup();
    // Unresolved promise simulates ongoing pending state
    (httpClient.patch as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderWithQuery(
      <LogStatusModal
        vehicle={mockVehicle}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const saveButton = screen.getByRole('button', { name: /save status/i });
    await user.click(saveButton);

    expect(
      screen.getByRole('button', { name: /saving\.\.\./i }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    // Verify backdrop/cancel interaction cannot trigger onOpenChange during pending state
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });
});
