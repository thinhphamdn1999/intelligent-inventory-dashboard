import { onLCP, onINP, onCLS } from 'web-vitals';

import logger from '@/services/logger';

export function reportWebVitals(): void {
  onLCP((metric) =>
    logger.info('Web Vital: LCP', {
      value: metric.value,
      rating: metric.rating,
    }),
  );
  onINP((metric) =>
    logger.info('Web Vital: INP', {
      value: metric.value,
      rating: metric.rating,
    }),
  );
  onCLS((metric) =>
    logger.info('Web Vital: CLS', {
      value: metric.value,
      rating: metric.rating,
    }),
  );
}
