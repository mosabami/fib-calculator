import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Fib from './Fib';

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Routes>
            <Route path="/" element={<Fib />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
