import { ALARM_NAME, STORAGE_KEY, initialState } from './timer';

// chrome.alarms wakes the service worker even after Chrome suspended it,
// unlike setTimeout, which dies with the worker after ~30s idle.
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  await chrome.storage.local.set({ [STORAGE_KEY]: initialState() });
  await chrome.notifications.create('pomodoroNotification', {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: 'Pomodoro Timer',
    message: 'Time is up! Take a break.',
    priority: 2,
  });
});
