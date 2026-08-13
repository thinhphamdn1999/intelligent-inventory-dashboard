import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VehiclePagination from '@/components/vehicle-pagination';

describe('VehiclePagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation landmark and page links', () => {
    render(
      <VehiclePagination
        page={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />,
    );

    expect(
      screen.getByRole('navigation', { name: /pagination/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /go to previous page/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /go to next page/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('marks current page link as active', () => {
    render(
      <VehiclePagination
        page={2}
        totalPages={4}
        onPageChange={mockOnPageChange}
      />,
    );

    const activePage = screen.getByRole('button', { name: '2' });
    const inactivePage = screen.getByRole('button', { name: '1' });

    expect(activePage).toHaveAttribute('aria-current', 'page');
    expect(activePage).toHaveAttribute('data-active', 'true');
    expect(inactivePage).not.toHaveAttribute('aria-current');
  });

  it('disables previous button on the first page', () => {
    render(
      <VehiclePagination
        page={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />,
    );

    const previousBtn = screen.getByRole('button', {
      name: /go to previous page/i,
    });

    expect(previousBtn).toHaveAttribute('aria-disabled', 'true');
    expect(previousBtn).toHaveClass('pointer-events-none', 'opacity-50');
  });

  it('disables next button on the last page', () => {
    render(
      <VehiclePagination
        page={3}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />,
    );

    const nextBtn = screen.getByRole('button', { name: /go to next page/i });

    expect(nextBtn).toHaveAttribute('aria-disabled', 'true');
    expect(nextBtn).toHaveClass('pointer-events-none', 'opacity-50');
  });

  it('enables previous and next buttons on middle page', () => {
    render(
      <VehiclePagination
        page={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />,
    );

    const previousBtn = screen.getByRole('button', {
      name: /go to previous page/i,
    });
    const nextBtn = screen.getByRole('button', { name: /go to next page/i });

    expect(previousBtn).toHaveAttribute('aria-disabled', 'false');
    expect(nextBtn).toHaveAttribute('aria-disabled', 'false');
  });

  it('invokes onPageChange with target page when clicking a page number', async () => {
    const user = userEvent.setup();

    render(
      <VehiclePagination
        page={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('invokes onPageChange with previous page when clicking previous button', async () => {
    const user = userEvent.setup();

    render(
      <VehiclePagination
        page={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: /go to previous page/i }),
    );

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('invokes onPageChange with next page when clicking next button', async () => {
    const user = userEvent.setup();

    render(
      <VehiclePagination
        page={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /go to next page/i }));

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('shows right ellipsis when near start (e.g. page 2 of 20)', () => {
    render(
      <VehiclePagination
        page={2}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />,
    );

    // Pages 1, 2, 3, 4, and 20 should be visible
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument();

    // Intermediate pages should not be visible
    expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument();

    // Exactly one ellipsis should render
    expect(screen.getAllByText(/more pages/i)).toHaveLength(1);
  });

  it('shows left and right ellipsis when in the middle (e.g. page 10 of 20)', () => {
    render(
      <VehiclePagination
        page={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />,
    );

    // Page 1, surrounding pages (9, 10, 11), and page 20 should be visible
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '11' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument();

    // Pages outside middle window shouldn't render
    expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '12' }),
    ).not.toBeInTheDocument();

    // Two ellipses should render (left and right)
    expect(screen.getAllByText(/more pages/i)).toHaveLength(2);
  });

  it('shows left ellipsis when near the end (e.g. page 19 of 20)', () => {
    render(
      <VehiclePagination
        page={19}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />,
    );

    // Page 1 and last 4 pages (17, 18, 19, 20) should be visible
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '17' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '18' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '19' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument();

    // Middle pages should not be visible
    expect(
      screen.queryByRole('button', { name: '16' }),
    ).not.toBeInTheDocument();

    // Exactly one ellipsis should render
    expect(screen.getAllByText(/more pages/i)).toHaveLength(1);
  });
});
