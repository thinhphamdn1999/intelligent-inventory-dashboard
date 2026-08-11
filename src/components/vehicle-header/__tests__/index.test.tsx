import { render, screen, within } from '@testing-library/react';

import VehicleHeader from '@/components/vehicle-header';

describe('VehicleHeader', () => {
  it('renders with row role', () => {
    render(<VehicleHeader />);

    expect(screen.getByRole('row')).toBeInTheDocument();
  });

  it('renders all column headers with correct text', () => {
    render(<VehicleHeader />);

    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(6);

    const expectedHeaderTitles = [
      'Vehicle (VIN)',
      'Make',
      'Model',
      'In inventory since',
      'Status',
      'Action',
    ];

    expectedHeaderTitles.forEach((title) => {
      expect(
        screen.getByRole('columnheader', { name: title }),
      ).toBeInTheDocument();
    });
  });

  it('maintains proper column order', () => {
    render(<VehicleHeader />);

    const row = screen.getByRole('row');
    const headers = within(row).getAllByRole('columnheader');

    expect(headers[0]).toHaveTextContent('Vehicle (VIN)');
    expect(headers[1]).toHaveTextContent('Make');
    expect(headers[2]).toHaveTextContent('Model');
    expect(headers[3]).toHaveTextContent('In inventory since');
    expect(headers[4]).toHaveTextContent('Status');
    expect(headers[5]).toHaveTextContent('Action');
  });
});
