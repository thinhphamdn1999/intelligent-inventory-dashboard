import { Route, Routes } from 'react-router';

import { ROUTES } from '@/constants/route';

import { Toaster } from '@/components/common/toast/toast';
import ErrorBoundary from '@/components/error-boundary';

import Dashboard from '@/pages/dashboard';

function App() {
  return (
    <>
      <Toaster />
      <ErrorBoundary>
        <Routes>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
