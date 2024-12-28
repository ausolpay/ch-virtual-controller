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

// Track pressed buttons
let activeButtons = new Set();
let connectedDevice = null;

// Add Event Listeners
document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", (e) => {
        handleButtonPress(e.target.id, true);
    });

    button.addEventListener("mouseup", (e) => {
        handleButtonPress(e.target.id, false);
    });

    button.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevent scrolling
        handleButtonPress(e.target.id, true);
    });

    button.addEventListener("touchend", (e) => {
        e.preventDefault(); // Prevent scrolling
        handleButtonPress(e.target.id, false);
    });
});

// Handle Button Press
function handleButtonPress(buttonId, isPressed) {
    if (!buttonMap[buttonId]) return;

    if (isPressed) {
        activeButtons.add(buttonId);
        console.log(`Button pressed: ${buttonId}`);
    } else {
        activeButtons.delete(buttonId);
        console.log(`Button released: ${buttonId}`);
    }

    sendHIDReport();
}

// Send HID Report
function sendHIDReport() {
    if (connectedDevice) {
        const report = new Uint8Array(Array.from(activeButtons).map((btn) => buttonMap[btn]));
        console.log(`Sending HID report: ${Array.from(activeButtons).join(", ")}`);
        // Actual HID reporting logic goes here
    } else {
        console.log("No device connected.");
    }
}

// Bluetooth Connection
document.getElementById("connect").addEventListener("click", async () => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["human_interface_device"],
        });

        connectedDevice = await device.gatt.connect();
        console.log(`Connected to device: ${device.name}`);
        alert(`Connected to: ${device.name}`);
    } catch (error) {
        console.error("Bluetooth connection failed:", error);
        alert(`Failed to connect to Bluetooth: ${error.message}`);
    }
});

// Switch Modes
document.getElementById("mode1").addEventListener("click", () => switchMode("mode1"));
document.getElementById("mode2").addEventListener("click", () => switchMode("mode2"));

function switchMode(mode) {
    document.getElementById("controller").className = mode;
    console.log(`Switched to ${mode}`);
}
