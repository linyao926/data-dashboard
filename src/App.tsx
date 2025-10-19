import React from 'react';
import './App.css';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}

export default App;
