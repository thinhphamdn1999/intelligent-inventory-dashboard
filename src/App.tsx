import { Route, Routes } from 'react-router';

import { ROUTES } from '@/constants/route';

import { Toaster } from '@/components/common/toast/toast';

import Dashboard from '@/pages/dashboard';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
