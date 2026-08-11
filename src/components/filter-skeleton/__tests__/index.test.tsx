import { render, screen } from '@testing-library/react';
import FilterSkeleton from '../index';

describe('FilterSkeleton', () => {
  it('renders the skeleton component', () => {
    render(<FilterSkeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has correct aria-label for accessibility', () => {
    render(<FilterSkeleton />);
    expect(screen.getByLabelText('Loading filters')).toBeInTheDocument();
  });

  it('renders multiple skeleton elements', () => {
    const { container } = render(<FilterSkeleton />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('applies correct layout classes for responsive design', () => {
    const { container } = render(<FilterSkeleton />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-2');
  });

  it('renders filter input skeletons', () => {
    const { container } = render(<FilterSkeleton />);
    const inputSkeletons = container.querySelectorAll('[class*="h-9"]');
    expect(inputSkeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('renders label skeletons hidden on mobile', () => {
    const { container } = render(<FilterSkeleton />);
    const labelSkeletons = container.querySelectorAll('[class*="hidden"][class*="sm:block"]');
    expect(labelSkeletons.length).toBeGreaterThan(0);
  });
});