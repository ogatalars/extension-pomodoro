import { describe, expect, it } from 'vitest';
import { POMODORO_MS, formatTime, initialState, isRunning, parseState, pause, remainingMs, start } from './timer';

describe('timer', () => {
  it('starts with a full pomodoro, stopped', () => {
    const s = initialState();
    expect(isRunning(s)).toBe(false);
    expect(remainingMs(s, 123)).toBe(POMODORO_MS);
  });

  it('counts down from a deadline and clamps at zero', () => {
    const s = start(initialState(), 1_000);
    expect(s.endAt).toBe(1_000 + POMODORO_MS);
    expect(remainingMs(s, 1_000 + 60_000)).toBe(POMODORO_MS - 60_000);
    expect(remainingMs(s, 1_000 + POMODORO_MS + 5_000)).toBe(0);
  });

  it('pause keeps the remaining time and resume continues from it', () => {
    const paused = pause(start(initialState(), 0), 10_000);
    expect(paused).toEqual({ endAt: null, remainingMs: POMODORO_MS - 10_000 });
    expect(remainingMs(paused, 999_999)).toBe(POMODORO_MS - 10_000);
    const resumed = start(paused, 50_000);
    expect(resumed.endAt).toBe(50_000 + POMODORO_MS - 10_000);
  });

  it('start and pause are idempotent', () => {
    const running = start(initialState(), 0);
    expect(start(running, 5_000)).toBe(running);
    const stopped = initialState();
    expect(pause(stopped, 5_000)).toBe(stopped);
  });

  it('rejects malformed storage values', () => {
    expect(parseState(undefined)).toEqual(initialState());
    expect(parseState({ endAt: 'x', remainingMs: 1 })).toEqual(initialState());
    expect(parseState({ endAt: null, remainingMs: -1 })).toEqual(initialState());
    expect(parseState({ endAt: 5, remainingMs: 10 })).toEqual({ endAt: 5, remainingMs: 10 });
  });

  it('formats mm:ss rounding up partial seconds', () => {
    expect(formatTime(POMODORO_MS)).toBe('25:00');
    expect(formatTime(59_001)).toBe('01:00');
    expect(formatTime(0)).toBe('00:00');
  });
});
