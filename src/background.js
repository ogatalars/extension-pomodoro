let timeLeft = 25 * 60;
let isRunning = false;
let timer = null;

console.log('Background script running...');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Service worker registered');
  chrome.storage.local.set({ timeLeft, isRunning });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  if (message.type === 'START_TIMER') {
    isRunning = true;
    chrome.storage.local.set({ isRunning });
    if (!timer) startTimer();
    sendResponse({ timeLeft, isRunning });
  } else if (message.type === 'PAUSE_TIMER') {
    isRunning = false;
    chrome.storage.local.set({ isRunning });
    if (timer) clearTimeout(timer);
    timer = null;
    sendResponse({ timeLeft, isRunning });
  } else if (message.type === 'RESET_TIMER') {
    isRunning = false;
    timeLeft = 25 * 60;
    chrome.storage.local.set({ timeLeft, isRunning });
    if (timer) clearTimeout(timer);
    timer = null;
    sendResponse({ timeLeft, isRunning });
  } else if (message.type === 'GET_TIME') {
    console.log('Responding to GET_TIME');
    sendResponse({ timeLeft, isRunning });
  }
});

function startTimer() {
  console.log('Timer started');
  if (isRunning && timeLeft > 0) {
    timer = setTimeout(() => {
      timeLeft -= 1;
      chrome.storage.local.set({ timeLeft });
      console.log('Time left:', timeLeft);
      startTimer();
    }, 1000);
  } else if (timeLeft === 0) {
    console.log('Time is up');
    isRunning = false;
    chrome.storage.local.set({ isRunning });
    chrome.notifications.create('pomodoroNotification', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Pomodoro Timer',
      message: 'Time is up!',
      priority: 2
    });
    timeLeft = 25 * 60;
    chrome.storage.local.set({ timeLeft });
  }
}
