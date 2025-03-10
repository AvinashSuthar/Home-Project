let electricity = "OFF";
// only for the prod purpose
let motorsOriginalState = ["ON", "ON", "ON", "ON"];

let motorPhoneState = ["OFF", "OFF", "ON", "OFF"];

const io = require("socket.io-client");
const axios = require("axios");
const BACKEND_URL = "https://sutharagriculture.onrender.com";
const socket = io(BACKEND_URL);
let devices = [];

// Fetch initial device states from the backend
const fetchInitialDevicesStates = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/devices/get`);
    devices = response.data;
    console.log("Initial device states:", devices);
    motorPhoneState = devices.map((device) => device.state);
    console.log("phone state");
    console.log(motorPhoneState);
  } catch (error) {
    console.error("Error fetching devices:", error);
  }
};

// Update device state locally
const updateLocalDeviceState = (deviceId, newState) => {
  devices = devices.map((device) =>
    device.deviceId === deviceId
      ? { ...device, state: newState, lastStateChange: new Date() }
      : device
  );
};

// Emit state changes to the backend
const sendOriginalStateUpdateToBackend = (deviceId, state) => {
  socket.emit("updateOriginalState", { deviceId, state });
};

// Emit electricity state update to the backend
const sendElectricityStateUpdateToBackend = (state) => {
  socket.emit("updateElectricityState", { state });
};

// Simulate electricity state changes
// take input from the raspberry pi
const simulateElectricityStateChange = () => {
  setInterval(() => {
    electricity = electricity === "ON" ? "OFF" : "ON";
    sendElectricityStateUpdateToBackend(electricity);
  }, 5000);
};

// Update the original state of devices every 5 seconds
const updateDeviceOriginalState = () => {
  devices.forEach((device, key) => {
    const newOriginalState = motorsOriginalState[key] === "ON" ? "OFF" : "ON";
    motorsOriginalState[key] === "ON"
      ? (motorsOriginalState[key] = "OFF")
      : (motorsOriginalState[key] = "ON");
    device.originalState = newOriginalState;
    sendOriginalStateUpdateToBackend(device.deviceId, newOriginalState);
  });
  console.log("Original state ");
  console.log(motorsOriginalState);
};

// Handle incoming state updates from the backend
socket.on("stateUpdated", (update) => {
  updateLocalDeviceState(update.deviceId, update.state);
  motorPhoneState = devices.map((device) => device.state);
  console.log("phone state");
  console.log(motorPhoneState);
});

// Initialize connection and fetch initial states
socket.on("connect", async () => {
  console.log("Connected to backend");
  await fetchInitialDevicesStates();
});

// Reconnect handling
socket.on("disconnect", () => {
  console.log("Disconnected from backend");
});

// Start simulations
simulateElectricityStateChange();
setInterval(updateDeviceOriginalState, 40000); // Update device original state every 5 seconds
