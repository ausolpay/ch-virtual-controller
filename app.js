// Button Mapping
const buttonMap = {
    red: 0x01,
    yellow: 0x02,
    green: 0x03,
    blue: 0x04,
    orange: 0x05,
    strum: 0x06,
    "star-power": 0x07,
    start: 0x08,
    select: 0x09,
    up: 0x0A,
    down: 0x0B,
    left: 0x0C,
    right: 0x0D,
};

// Current Mode
let currentMode = "mode1";

// Set to track pressed buttons
let activeButtons = new Set();

// Add Event Listeners
document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", (e) => {
        handleButtonPress(e.target.id, true);
    });

    button.addEventListener("mouseup", (e) => {
        handleButtonPress(e.target.id, false);
    });

    button.addEventListener("mouseleave", (e) => {
        handleButtonPress(e.target.id, false);
    });

    button.addEventListener("touchstart", (e) => {
        handleButtonPress(e.target.id, true);
        e.preventDefault();
    });

    button.addEventListener("touchend", (e) => {
        handleButtonPress(e.target.id, false);
        e.preventDefault();
    });
});

// Handle Button Press and Release
function handleButtonPress(buttonId, isPressed) {
    if (buttonMap[buttonId]) {
        if (isPressed) {
            activeButtons.add(buttonId);
            console.log(`Button pressed: ${buttonId}`);
            sendHIDReport([...activeButtons]);
        } else {
            activeButtons.delete(buttonId);
            console.log(`Button released: ${buttonId}`);
            sendHIDReport([...activeButtons]);
        }
    }
}

// Switch Modes
document.getElementById("mode1").addEventListener("click", () => switchMode("mode1"));
document.getElementById("mode2").addEventListener("click", () => switchMode("mode2"));

function switchMode(mode) {
    currentMode = mode;
    document.getElementById("controller").className = mode;
    alert(`Switched to ${mode}`);
}

// Bluetooth HID Connection
let connectedDevice = null;

document.getElementById("connect").addEventListener("click", async () => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["human_interface_device"],
        });

        console.log(`Connected to device: ${device.name}`);
        connectedDevice = device;

        alert(`Connected to: ${device.name}`);
    } catch (error) {
        console.error("Bluetooth connection failed:", error);
        alert("Failed to connect to Bluetooth. Make sure you are using Chrome and a secure context.");
    }
});

// Send HID Report
function sendHIDReport(activeButtons) {
    if (connectedDevice) {
        const report = new Uint8Array(activeButtons.map((btn) => buttonMap[btn]));
        console.log(`Sending HID report: ${[...activeButtons].join(", ")}`);
        // Implement actual HID reporting here
    } else {
        console.log("No device connected.");
    }
}
