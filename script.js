const car1 = document.getElementById("car1");
const car2 = document.getElementById("car2");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const stopBtn = document.getElementById("stopBtn");

const car1SpeedInput = document.getElementById("car1Speed");
const car2SpeedInput = document.getElementById("car2Speed");
const car2DutyCycleInput = document.getElementById("car2DutyCycle");
const car2FrequencyInput = document.getElementById("car2Frequency");
const roadLengthInput = document.getElementById("roadLength");
const resumeBtn = document.getElementById("resumeBtn");

let containerWidth = document.getElementById("container").clientWidth;
const carWidth = car1.clientWidth;

let car1Left = -carWidth / 2;
let car2Left = -carWidth / 2;
let car1Speed = 4; // m/s
let car2Speed = 8; // m/s
let car2DutyCycle = 50; // %
let car2Frequency = 1; // Hz
let roadLength = 4; // m
let car2OnDelay = (1 / car2Frequency) * (car2DutyCycle / 100) * 1000; // ms
let car2OffDelay = (1 / car2Frequency) * (1 - car2DutyCycle / 100) * 1000; // ms
let mainInterval;
let car2Running = false;
let car2ToggleTime = car2OffDelay;

function reset() {
  clearInterval(mainInterval);
  car1Left = -carWidth / 2;
  car2Left = -carWidth / 2;
  car1.style.transform = `translateX(${car1Left}px)`;
  car2.style.transform = `translateX(${car2Left}px)`;
  car2Running = false;
  car2ToggleTime = car2OffDelay;
  updateSimulationVariables();
}

function updateSimulationVariables() {
  car1Speed = parseFloat(car1SpeedInput.value);
  car2Speed = parseFloat(car2SpeedInput.value);
  car2DutyCycle = parseFloat(car2DutyCycleInput.value);
  car2Frequency = parseFloat(car2FrequencyInput.value);
  roadLength = parseFloat(roadLengthInput.value);
  let totalTime = (1 / car2Frequency) * 1000; // Total time period in ms
  car2OnDelay = totalTime * (car2DutyCycle / 100);
  car2OffDelay = totalTime - car2OnDelay;
}

car1SpeedInput.addEventListener("input", updateSimulationVariables);
car2SpeedInput.addEventListener("input", updateSimulationVariables);
car2DutyCycleInput.addEventListener("input", updateSimulationVariables);
car2FrequencyInput.addEventListener("input", updateSimulationVariables);
roadLengthInput.addEventListener("input", updateSimulationVariables);

function run() {
  stopBtn.hidden = false;
  resumeBtn.hidden = true;

  clearInterval(mainInterval); // Clear previous interval if exists

  reset();

  // Check for valid on and off times
  if (car2OnDelay < 5 || car2OffDelay < 5) {
    if (
      car2OnDelay - parseInt(car2OnDelay) !== 0 ||
      car2OffDelay - parseInt(car2OffDelay) !== 0
    ) {
      alert(
        "Simulation capabilities cannot handle these numbers. Please choose other numbers. (Reduce frequency)"
      );
    }
    return false;
  }

  startInterval();
}

function stop() {
  clearInterval(mainInterval);
  stopBtn.hidden = true;
  resumeBtn.hidden = false;
}

function resume() {
  stopBtn.hidden = false;
  resumeBtn.hidden = true;
  startInterval();
}

function startInterval() {
  mainInterval = setInterval(() => {
    if (car1Left + carWidth / 2 < containerWidth) {
      car1Left += (car1Speed / 1000) * (containerWidth / roadLength);
      car1.style.transform = `translateX(${car1Left}px)`;
    }

    car2ToggleTime -= 1;
    if (car2ToggleTime <= 0) {
      car2Running = !car2Running;
      car2ToggleTime = car2Running ? car2OnDelay : car2OffDelay;
    }

    if (car2Running && car2Left + carWidth / 2 < containerWidth) {
      car2Left += (car2Speed / 1000) * (containerWidth / roadLength);
      car2.style.transform = `translateX(${car2Left}px)`;
    }
  }, 1); // 1000 FPS
}
runBtn.addEventListener("click", run);
resetBtn.addEventListener("click", reset);
stopBtn.addEventListener("click", stop);
resumeBtn.addEventListener("click", resume);

// Adjust sizes on window resize
window.addEventListener("resize", () => {
  containerWidth = document.getElementById("container").clientWidth;
  reset();
});

// Initialize positions
reset();
