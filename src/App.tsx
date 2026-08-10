import { Route, Routes } from 'react-router';

import { ROUTES } from '@/constants/route';

import Dashboard from '@/pages/dashboard';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
    </Routes>
  );
}

export default App;
