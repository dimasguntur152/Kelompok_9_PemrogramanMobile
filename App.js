import React from 'react';
import { AppProvider } from './src/context/AppContext';
import { AppRoot } from './src/AppRoot';

export default function App() {
  return (
    <AppProvider>
      <AppRoot />
    </AppProvider>
  );
}
