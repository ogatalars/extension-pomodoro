import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const updateStateFromStorage = () => {
      chrome.storage.local.get(['timeLeft', 'isRunning'], (result) => {
        if (result.timeLeft !== undefined) setTimeLeft(result.timeLeft);
        if (result.isRunning !== undefined) setIsRunning(result.isRunning);
      });
    };

    updateStateFromStorage();
    const intervalId = setInterval(updateStateFromStorage, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleStartPause = () => {
    const messageType = isRunning ? 'PAUSE_TIMER' : 'START_TIMER';
    chrome.runtime.sendMessage({ type: messageType }, (response) => {
      if (response) {
        setTimeLeft(response.timeLeft);
        setIsRunning(response.isRunning);
      }
    });
  };

  const handleReset = () => {
    chrome.runtime.sendMessage({ type: 'RESET_TIMER' }, (response) => {
      if (response) {
        setTimeLeft(response.timeLeft);
        setIsRunning(response.isRunning);
      }
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <div>{formatTime(timeLeft)}</div>
      <button onClick={handleStartPause}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default PomodoroTimer;
