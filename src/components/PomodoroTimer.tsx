import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      alert('Time is up!');
      setIsRunning(false);
      setTimeLeft(25 * 60);
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <div>{formatTime(timeLeft)}</div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setTimeLeft(25 * 60)}>Reset</button>
    </div>
  );
};

export default PomodoroTimer;
