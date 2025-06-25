import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import MainDashboard from './MainDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Homepage route */}
        <Route path="/" element={<Homepage />} />

        {/* Main Dashboard route */}
        <Route path="/dashboard" element={<MainDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;