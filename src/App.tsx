import React from 'react';
import './App.css';
import PomodoroTimer from './components/PomodoroTimer';

const App: React.FC = () => {
  return (
    <div className="App">
      <PomodoroTimer />
    </div>
  );
};

export default App;
