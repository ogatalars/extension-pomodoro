// Pure timer logic: the state is a deadline, not a ticking counter, so it survives
// the MV3 service worker being suspended and the popup being closed.
export const POMODORO_MS = 25 * 60 * 1000;
export const STORAGE_KEY = 'timer';
export const ALARM_NAME = 'pomodoro';

export interface TimerState {
  /** Epoch ms when the running session ends; null when paused/stopped. */
  endAt: number | null;
  /** Remaining ms while paused/stopped. */
  remainingMs: number;
}

export const initialState = (): TimerState => ({ endAt: null, remainingMs: POMODORO_MS });

export const isRunning = (s: TimerState) => s.endAt !== null;

export const remainingMs = (s: TimerState, now: number) =>
  s.endAt === null ? s.remainingMs : Math.max(0, s.endAt - now);

export const start = (s: TimerState, now: number): TimerState =>
  isRunning(s) ? s : { endAt: now + s.remainingMs, remainingMs: s.remainingMs };

export const pause = (s: TimerState, now: number): TimerState =>
  isRunning(s) ? { endAt: null, remainingMs: remainingMs(s, now) } : s;

/** Validates whatever came out of storage; falls back to a fresh timer. */
export const parseState = (raw: unknown): TimerState => {
  const s = raw as Partial<TimerState> | undefined;
  const okEnd = s?.endAt === null || Number.isFinite(s?.endAt);
  const okRem = Number.isFinite(s?.remainingMs) && s!.remainingMs! >= 0 && s!.remainingMs! <= POMODORO_MS;
  return okEnd && okRem ? { endAt: s!.endAt!, remainingMs: s!.remainingMs! } : initialState();
};

export const formatTime = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const mm = Math.floor(total / 60).toString().padStart(2, '0');
  const ss = (total % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
};
