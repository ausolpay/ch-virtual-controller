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

// Track active buttons
let activeButtons = new Set();
let connectedDevice = null;

// Utility function for logging
function log(message) {
    console.log(message);
    alert(message); // Show pop-up alerts for Android
}

// Add event listeners for all buttons
document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", (e) => handleButtonPress(e.target.id, true));
    button.addEventListener("mouseup", (e) => handleButtonPress(e.target.id, false));
    button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleButtonPress(e.target.id, true);
    });
    button.addEventListener("touchend", (e) => {
        e.preventDefault();
        handleButtonPress(e.target.id, false);
    });
});

// Handle button presses and releases
function handleButtonPress(buttonId, isPressed) {
    if (buttonMap[buttonId]) {
        if (isPressed) {
            activeButtons.add(buttonId);
            log(`Button pressed: ${buttonId}`);
        } else {
            activeButtons.delete(buttonId);
            log(`Button released: ${buttonId}`);
        }
        sendHIDReport();
    }
}

// Send HID report to the connected Bluetooth device
function sendHIDReport() {
    if (connectedDevice) {
        const report = new Uint8Array(Array.from(activeButtons).map((btn) => buttonMap[btn]));
        log(`Sending HID report: ${Array.from(activeButtons).join(", ")}`);
        // Actual HID reporting logic goes here
    } else {
        log("No device connected.");
    }
}

// Handle Bluetooth connection
document.getElementById("connect").addEventListener("click", async () => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["human_interface_device"],
        });

        connectedDevice = await device.gatt.connect();
        log(`Connected to device: ${device.name}`);
    } catch (error) {
        log(`Bluetooth connection failed: ${error.message}`);
    }
});

// Switch modes
document.getElementById("mode1").addEventListener("click", () => switchMode("mode1"));
document.getElementById("mode2").addEventListener("click", () => switchMode("mode2"));

function switchMode(mode) {
    document.getElementById("controller").className = mode;
    log(`Switched to ${mode}`);
}
