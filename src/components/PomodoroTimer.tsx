import React, { useEffect, useState } from 'react';
import {
  ALARM_NAME, STORAGE_KEY, TimerState, formatTime, initialState, isRunning, parseState, pause, remainingMs, start,
} from '../timer';

const save = (s: TimerState) => chrome.storage.local.set({ [STORAGE_KEY]: s });

const PomodoroTimer: React.FC = () => {
  const [state, setState] = useState<TimerState>(initialState);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY).then((r) => setState(parseState(r[STORAGE_KEY])));
    const onChanged = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'local' && STORAGE_KEY in changes) setState(parseState(changes[STORAGE_KEY].newValue));
    };
    chrome.storage.onChanged.addListener(onChanged);
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => {
      chrome.storage.onChanged.removeListener(onChanged);
      clearInterval(id);
    };
  }, []);

  const running = isRunning(state);

  const handleStartPause = async () => {
    const t = Date.now();
    if (running) {
      await chrome.alarms.clear(ALARM_NAME);
      await save(pause(state, t));
    } else {
      const next = start(state, t);
      await chrome.alarms.create(ALARM_NAME, { when: next.endAt! });
      await save(next);
    }
  };

  const handleReset = async () => {
    await chrome.alarms.clear(ALARM_NAME);
    await save(initialState());
  };

  return (
    <main>
      <h1>Pomodoro Timer</h1>
      <div role="timer" aria-label="Time left" className="time">
        {formatTime(remainingMs(state, now))}
      </div>
      <button onClick={handleStartPause} aria-pressed={running}>
        {running ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>
    </main>
  );
};

export default PomodoroTimer;
