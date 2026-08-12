import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { QUERY_CONFIG } from '@/constants/query-config.ts';

import { reportWebVitals } from '@/services/web-vitals.ts';

import App from './App.tsx';

import './index.css';

reportWebVitals();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: QUERY_CONFIG.RETRY,
      staleTime: QUERY_CONFIG.STALE_TIME,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
