import { render, screen } from '@testing-library/react';

import VehicleSkeleton from '@/components/vehicle-skeleton';

describe('VehicleSkeleton', () => {
  it('renders status role with correct accessibility label', () => {
    render(<VehicleSkeleton />);

    const container = screen.getByRole('status', {
      name: /loading vehicles/i,
    });
    expect(container).toBeInTheDocument();
  });

  it('renders default number of 10 rows when rows prop is omitted', () => {
    render(<VehicleSkeleton />);

    const statusElement = screen.getByRole('status', {
      name: /loading vehicles/i,
    });

    expect(statusElement.children).toHaveLength(10);
  });

  it('renders custom number of rows when rows prop is specified', () => {
    const customRows = 5;
    render(<VehicleSkeleton rows={customRows} />);

    const statusElement = screen.getByRole('status', {
      name: /loading vehicles/i,
    });

    expect(statusElement.children).toHaveLength(customRows);
  });

  it('handles 0 rows gracefully without throwing', () => {
    render(<VehicleSkeleton rows={0} />);

    const statusElement = screen.getByRole('status', {
      name: /loading vehicles/i,
    });

    expect(statusElement.children).toHaveLength(0);
  });
});
