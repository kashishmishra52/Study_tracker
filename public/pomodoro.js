let timer;
let minutes = 25;
let seconds = 0;
let sessionCount = 0;
let running = false;

function updateDisplay() {
  document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
  document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
  if (running) return;
  running = true;
  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer);
        sessionCount++;
        document.getElementById("sessionCount").textContent = sessionCount;
        running = false;
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    updateDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  minutes = 25;
  seconds = 0;
  running = false;
  updateDisplay();
}

updateDisplay();
