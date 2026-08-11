import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectFilter from '@/components/select-filter';
import type { SelectOption } from '@/types/select';

const options: SelectOption[] = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
];

describe('SelectFilter', () => {
  it('renders the label and placeholder', () => {
    render(
      <SelectFilter
        label="Maker"
        value=""
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Maker')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders a custom placeholder when provided', () => {
    render(
      <SelectFilter
        label="Model"
        placeholder="Choose a model"
        value=""
        options={options}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Choose a model')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is true', () => {
    render(
      <SelectFilter
        label="Model"
        value=""
        options={options}
        onChange={jest.fn()}
        disabled
      />,
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onChange with the selected value when an option is picked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <SelectFilter
        label="Maker"
        value=""
        options={options}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('Honda'));

    expect(handleChange).toHaveBeenCalledWith('honda');
  });

  it('renders every option passed in when opened', async () => {
    const user = userEvent.setup();

    render(
      <SelectFilter
        label="Maker"
        value=""
        options={options}
        onChange={jest.fn()}
      />,
    );

    await user.click(screen.getByRole('combobox'));

    expect(await screen.findByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Honda')).toBeInTheDocument();
  });

  it('renders no options when the options list is empty', async () => {
    const user = userEvent.setup();

    render(
      <SelectFilter label="Model" value="" options={[]} onChange={jest.fn()} />,
    );

    await user.click(screen.getByRole('combobox'));

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });
});
