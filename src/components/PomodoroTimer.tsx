import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedTime = localStorage.getItem('timeLeft');
    return savedTime ? parseInt(savedTime) : 25 * 60;
  });
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const savedRunning = localStorage.getItem('isRunning');
    return savedRunning ? JSON.parse(savedRunning) : false;
  });

  useEffect(() => {
    localStorage.setItem('timeLeft', timeLeft.toString());
    localStorage.setItem('isRunning', JSON.stringify(isRunning));
  }, [timeLeft, isRunning]);

  useEffect(() => {
    const updateTime = () => {
      chrome.runtime.sendMessage({ type: 'GET_TIME' }, (response) => {
        if (response) {
          setTimeLeft(response.timeLeft);
          setIsRunning(response.isRunning);
        }
      });
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
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
