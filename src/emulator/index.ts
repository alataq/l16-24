import "../styles/theme.css";
import "../styles/emulator.css";

// RAM Slider
const ramSlider = document.getElementById('ram-slider') as HTMLInputElement;
const ramValue = document.getElementById('ram-value') as HTMLSpanElement;
ramValue.textContent = ramSlider.value;

ramSlider.addEventListener('input', () => {
    ramValue.textContent = ramSlider.value;
});

// CPU Clock Slider
const cpuClockSlider = document.getElementById('cpu-clock-slider') as HTMLInputElement;
const cpuClockValue = document.getElementById('cpu-clock-value') as HTMLSpanElement;
cpuClockValue.textContent = cpuClockSlider.value;

cpuClockSlider.addEventListener('input', () => {
    cpuClockValue.textContent = cpuClockSlider.value;
});

// Fullscreen
const screenContainer = document.getElementById('screen-container') as HTMLDivElement;
const emulatorScreen = document.getElementById('emulator-screen') as HTMLCanvasElement;


emulatorScreen.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        screenContainer.requestFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        // Any additional cleanup when exiting fullscreen can go here
    }
});
