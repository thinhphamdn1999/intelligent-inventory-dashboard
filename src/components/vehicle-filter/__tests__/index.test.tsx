import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Maker } from '@/types/maker';

import VehicleFilter from '@/components/vehicle-filter';

const mockMakers: Maker[] = [
  {
    id: '1',
    name: 'Toyota',
    models: ['Camry', 'Corolla', 'RAV4'],
  },
  {
    id: '2',
    name: 'Honda',
    models: ['Civic', 'Accord', 'CR-V'],
  },
];

describe('VehicleFilter', () => {
  const defaultProps = {
    makers: mockMakers,
    selectedMaker: '',
    selectedModel: '',
    onMakerChange: jest.fn(),
    onModelChange: jest.fn(),
    onClearFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter labels and clear button', () => {
    render(<VehicleFilter {...defaultProps} />);

    expect(screen.getByText('Maker')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).toBeInTheDocument();
  });

  it('disables the model dropdown when no maker is selected', () => {
    render(<VehicleFilter {...defaultProps} />);

    const [, modelSelect] = screen.getAllByRole('combobox');

    expect(modelSelect).toBeDisabled();
  });

  it('enables the model dropdown when a maker is selected', () => {
    render(
      <VehicleFilter
        {...defaultProps}
        selectedMaker="Toyota"
        selectedModel="Camry"
      />,
    );

    const [makerSelect, modelSelect] = screen.getAllByRole('combobox');

    expect(makerSelect).toHaveTextContent('Toyota');
    expect(modelSelect).not.toBeDisabled();
    expect(modelSelect).toHaveTextContent('Camry');
  });

  it('calls onMakerChange when a maker is selected', async () => {
    const user = userEvent.setup();
    const handleMakerChange = jest.fn();

    render(
      <VehicleFilter {...defaultProps} onMakerChange={handleMakerChange} />,
    );

    const [makerSelect] = screen.getAllByRole('combobox');
    await user.click(makerSelect);

    const option = await screen.findByRole('option', { name: 'Toyota' });
    await user.click(option);

    expect(handleMakerChange).toHaveBeenCalledWith('Toyota');
  });

  it('calls onModelChange when a model is selected', async () => {
    const user = userEvent.setup();
    const handleModelChange = jest.fn();

    render(
      <VehicleFilter
        {...defaultProps}
        selectedMaker="Toyota"
        onModelChange={handleModelChange}
      />,
    );

    const [, modelSelect] = screen.getAllByRole('combobox');
    await user.click(modelSelect);

    const option = await screen.findByRole('option', { name: 'Corolla' });
    await user.click(option);

    expect(handleModelChange).toHaveBeenCalledWith('Corolla');
  });

  it('calls onClearFilters when clear filters button is clicked', async () => {
    const user = userEvent.setup();
    const handleClearFilters = jest.fn();

    render(
      <VehicleFilter
        {...defaultProps}
        selectedMaker="Toyota"
        selectedModel="Camry"
        onClearFilters={handleClearFilters}
      />,
    );

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(handleClearFilters).toHaveBeenCalledTimes(1);
  });

  it('handles empty makers list gracefully without crashing', () => {
    render(<VehicleFilter {...defaultProps} makers={[]} />);

    const [makerSelect, modelSelect] = screen.getAllByRole('combobox');

    expect(makerSelect).toBeEnabled();
    expect(modelSelect).toBeDisabled();
  });

  it('disables the clear filters button when no filters are selected', () => {
    render(<VehicleFilter {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).toBeDisabled();
  });

  it('enables the clear filters button when a maker is selected', () => {
    render(<VehicleFilter {...defaultProps} selectedMaker="Toyota" />);

    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).toBeEnabled();
  });

  it('enables the clear filters button when a model is selected', () => {
    render(
      <VehicleFilter
        {...defaultProps}
        selectedMaker="Toyota"
        selectedModel="Camry"
      />,
    );

    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).toBeEnabled();
  });
});
