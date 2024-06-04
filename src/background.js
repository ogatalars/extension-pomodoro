let timeLeft = 25 * 60;
let isRunning = false;
let timer = null;

console.log('Background script running...');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Service worker registered');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  if (message.type === 'START_TIMER') {
    isRunning = true;
    if (!timer) startTimer();
    sendResponse({ timeLeft, isRunning });
  } else if (message.type === 'PAUSE_TIMER') {
    isRunning = false;
    if (timer) clearTimeout(timer);
    timer = null;
    sendResponse({ timeLeft, isRunning });
  } else if (message.type === 'RESET_TIMER') {
    isRunning = false;
    timeLeft = 25 * 60;
    if (timer) clearTimeout(timer);
    timer = null;
    sendResponse({ timeLeft, isRunning });
  } else if (message.type === 'GET_TIME') {
    console.log('Responding to GET_TIME');
    sendResponse({ timeLeft, isRunning });
  } else if (message.type === 'PING') {
    console.log('PING received, sending PONG');
    sendResponse({ type: 'PONG' });
  }
});

function startTimer() {
  console.log('Timer started');
  if (isRunning && timeLeft > 0) {
    timer = setTimeout(() => {
      timeLeft -= 1;
      console.log('Time left:', timeLeft);
      chrome.runtime.sendMessage({ type: 'UPDATE_TIME', timeLeft }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending UPDATE_TIME message:', chrome.runtime.lastError.message);
        } else {
          console.log('UPDATE_TIME message sent successfully');
        }
      });
      startTimer();
    }, 1000);
  } else if (timeLeft === 0) {
    console.log('Time is up');
    isRunning = false;
    chrome.notifications.create('pomodoroNotification', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Pomodoro Timer',
      message: 'Time is up!',
      priority: 2
    });
    timeLeft = 25 * 60;
  }
}
