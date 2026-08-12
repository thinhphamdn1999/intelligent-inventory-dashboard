
import { onLCP, onINP, onCLS } from 'web-vitals';

import logger from '@/services/logger';
import { reportWebVitals } from '@/services/web-vitals';

jest.mock('web-vitals', () => ({
  onLCP: jest.fn(),
  onINP: jest.fn(),
  onCLS: jest.fn(),
}));
jest.mock('@/services/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

describe('reportWebVitals', () => {
  it('registers callbacks for LCP, INP, and CLS', () => {
    reportWebVitals();
    expect(onLCP).toHaveBeenCalled();
    expect(onINP).toHaveBeenCalled();
    expect(onCLS).toHaveBeenCalled();
  });

  it('logs a metric through the logger when a callback fires', () => {
    reportWebVitals();
    const lcpCallback = (onLCP as jest.Mock).mock.calls[0][0];

    lcpCallback({ value: 1240, rating: 'good' });

    expect(logger.info).toHaveBeenCalledWith('Web Vital: LCP', {
      value: 1240,
      rating: 'good',
    });
  });
});
