import { cn } from '@/utils/cn';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('flex', 'gap-2')).toBe('flex gap-2');
  });

  it('resolves conflicting Tailwind classes, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('ignores falsy values', () => {
    const isHidden = false;
    expect(cn('flex', isHidden && 'hidden', undefined, null, 'gap-2')).toBe(
      'flex gap-2',
    );
  });

  it('applies conditional classes based on a boolean', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });
});
