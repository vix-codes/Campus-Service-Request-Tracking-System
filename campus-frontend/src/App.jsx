
import React from 'react';
import AppRouter from './router/AppRouter'; // Corrected import path
import GlobalSettings from './components/GlobalSettings';

const App = () => {
  return (
    <>
      <AppRouter />
      <GlobalSettings />
    </>
  );
};

export default App;
