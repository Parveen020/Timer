// CountdownTimer class definition
class CountdownTimer {
  // Constructor initializes timer with name, target date, and container
  constructor(name, targetDate, containerId) {
    this.name = name;
    this.targetDate = new Date(targetDate);
    this.containerId = containerId;
    this.timerId = `timer-${Date.now()}`; // Unique ID for each timer
    this.interval = null;
    this.alarmSound = document.getElementById("alarm-sound");
    this.hasPlayed = false;
    this.createTimer();
    this.startTimer();
  }

  // Creates timer DOM elements
  createTimer() {
    const timerElement = document.createElement("div");
    timerElement.className = "timer-card";
    timerElement.id = this.timerId;
    // HTML structure for timer display
    timerElement.innerHTML = `
          <h2>${this.name}</h2>
          <button class="delete-timer" onclick="deleteTimer('${this.timerId}')">
              <i class="fas fa-times"></i>
          </button>
          <div class="countdown-display">
              <div class="time-unit">
                  <div class="time-value" id="${this.timerId}-days">00</div>
                  <div class="time-label">Days</div>
              </div>
              <div class="time-unit">
                  <div class="time-value" id="${this.timerId}-hours">00</div>
                  <div class="time-label">Hours</div>
              </div>
              <div class="time-unit">
                  <div class="time-value" id="${this.timerId}-minutes">00</div>
                  <div class="time-label">Minutes</div>
              </div>
              <div class="time-unit">
                  <div class="time-value" id="${this.timerId}-seconds">00</div>
                  <div class="time-label">Seconds</div>
              </div>
          </div>
          <div id="${this.timerId}-message"></div>
      `;
    document.getElementById(this.containerId).prepend(timerElement);
  }

  // Updates timer display with current values
  updateDisplay(timeLeft) {
    const { days, hours, minutes, seconds } = timeLeft;
    document.getElementById(`${this.timerId}-days`).textContent = String(
      days
    ).padStart(2, "0");
    document.getElementById(`${this.timerId}-hours`).textContent = String(
      hours
    ).padStart(2, "0");
    document.getElementById(`${this.timerId}-minutes`).textContent = String(
      minutes
    ).padStart(2, "0");
    document.getElementById(`${this.timerId}-seconds`).textContent = String(
      seconds
    ).padStart(2, "0");
  }

  // Calculates time remaining
  calculateTimeLeft() {
    const total = this.targetDate - new Date();
    if (total <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      total,
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
    };
  }

  // Starts timer countdown
  startTimer() {
    const updateTimer = () => {
      const timeLeft = this.calculateTimeLeft();
      this.updateDisplay(timeLeft);

      const timerCard = document.getElementById(this.timerId);
      const messageElement = document.getElementById(`${this.timerId}-message`);

      // Handle timer expiration
      if (timeLeft.total <= 0) {
        timerCard.classList.add("expired");
        messageElement.textContent = "Countdown expired!";

        // Play alarm sound once
        if (!this.hasPlayed) {
          this.alarmSound
            .play()
            .catch((error) => console.log("Audio playback failed:", error));
          this.hasPlayed = true;
        }
      } else {
        timerCard.classList.remove("expired");
        messageElement.textContent = "";
      }
    };

    updateTimer();
    this.interval = setInterval(updateTimer, 1000);
  }

  // Stops timer
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Store active timers
const activeTimers = {};

// Function to add new timer
function addTimer(name, datetime) {
  const timer = new CountdownTimer(name, datetime, "timers-container");
  activeTimers[timer.timerId] = timer;
}

// Function to delete timer
function deleteTimer(timerId) {
  if (activeTimers[timerId]) {
    activeTimers[timerId].stop();
    delete activeTimers[timerId];
    const timerElement = document.getElementById(timerId);
    timerElement.addEventListener("animationend", () => {
      timerElement.remove();
    });
    timerElement.style.animation = "slideIn 0.3s ease-out reverse";
  }
}

// Event listener for add timer button
document.getElementById("add-timer").addEventListener("click", () => {
  const nameInput = document.getElementById("event-name");
  const datetimeInput = document.getElementById("datetime");

  // Validate inputs
  if (!nameInput.value || !datetimeInput.value) {
    alert("Please enter both event name and date/time!");
    return;
  }

  // Validate date
  const selectedDate = new Date(datetimeInput.value);
  if (selectedDate <= new Date()) {
    alert("Please select a future date and time!");
    return;
  }

  // Create new timer
  addTimer(nameInput.value, datetimeInput.value);

  // Reset form
  nameInput.value = "";
  datetimeInput.value = "";
});
