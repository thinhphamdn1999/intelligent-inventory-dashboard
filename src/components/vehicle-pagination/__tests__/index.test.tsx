import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VehiclePagination from '@/components/vehicle-pagination';

describe('VehiclePagination', () => {
  const mockClickHandler = jest.fn();
  const mockOnPageChange = jest.fn(() => mockClickHandler);

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

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
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

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
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

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});
