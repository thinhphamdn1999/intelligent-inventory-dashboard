import { getDiffTime, formatDate } from '@/utils/date';

describe('getDiffTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-11T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the correct day diff for a date exactly 90 days ago', () => {
    // 2026-08-11 minus 90 days = 2026-05-13
    expect(getDiffTime('2026-05-13')).toBe(90);
  });

  it('returns the correct day diff for a date 91 days ago', () => {
    // 2026-08-11 minus 91 days = 2026-05-12
    expect(getDiffTime('2026-05-12')).toBe(91);
  });

  it('returns the correct day diff for a date 89 days ago', () => {
    // 2026-08-11 minus 89 days = 2026-05-14
    expect(getDiffTime('2026-05-14')).toBe(89);
  });

  it('returns 0 for a date that is today', () => {
    expect(getDiffTime('2026-08-11')).toBe(0);
  });

  it('returns 0 for an empty string', () => {
    expect(getDiffTime('')).toBe(0);
  });

  it('returns 0 for an invalid date string', () => {
    expect(getDiffTime('not-a-real-date')).toBe(0);
  });

  it('respects a different unit (months)', () => {
    // 2026-08-11 minus ~3 months = 2026-05-11
    expect(getDiffTime('2026-05-11', 'month')).toBe(3);
  });

  it('respects a different unit (years)', () => {
    expect(getDiffTime('2024-08-11', 'year')).toBe(2);
  });
});

describe('formatDate', () => {
  it('formats a valid date with the given format string', () => {
    expect(formatDate('2026-05-12', 'YYYY-MM-DD')).toBe('2026-05-12');
  });

  it('formats a valid date into a human-readable format', () => {
    expect(formatDate('2026-05-12', 'MMM D, YYYY')).toBe('May 12, 2026');
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatDate('not-a-real-date', 'YYYY-MM-DD')).toBe('');
  });

  it('returns an empty string for an empty input', () => {
    expect(formatDate('', 'YYYY-MM-DD')).toBe('');
  });
});
