import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatTime from "./utils/formatTime";

const socket = io("https://sutharagriculture.onrender.com"); // Replace with your backend URL

const App = () => {
  const [devices, setDevices] = useState([]);
  const [electricity, setElectricity] = useState("OFF");
  const navigate = useNavigate();
  // Toggle device state
  const toggleDevice = (device) => {
    const newState = device.state === "ON" ? "OFF" : "ON";
    socket.emit("updateState", { deviceId: device.deviceId, state: newState });
  };
  let Totaltime = 0;
  devices.map((device) => {
    Totaltime += device.totalOnTime;
  });

  const handleReset = async (device) => {
    await axios.post(
      "https://sutharagriculture.onrender.com/resetTimer/new",
      {
        deviceId: device.deviceId,
        totaltime: device.totalOnTime,
      },
      {
        withCredentials: true,
      }
    );

    socket.emit("resetTimer", {
      deviceId: device.deviceId,
    });
  };

  useEffect(() => {
    // Fetch initial device states using axios
    axios
      .get("https://sutharagriculture.onrender.com/devices/get") // Replace with your backend URL
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      });

    // Fetch initial electricity state using axios
    axios
      .get("https://sutharagriculture.onrender.com/electricity/get") // Replace with your backend URL
      .then((res) => {
        setElectricity(res.data.state);
      })
      .catch((error) => {
        console.error("Error fetching electricity state:", error);
      });

    // Listen for state updates from the server
    socket.on("stateUpdated", (update) => {
      setDevices((prevDevices) => {
        const updatedDevices = prevDevices.map((device) =>
          device.deviceId === update.deviceId
            ? {
                ...device,
                state: update.state,
                lastStateChange: update.lastStateChange,
              } // Update the state and last change timestamp
            : device
        );
        return updatedDevices;
      });
    });
    socket.on("realTimeUpdate", ({ deviceId, elapsedTime }) => {
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.deviceId === deviceId
            ? { ...device, totalOnTime: elapsedTime }
            : device
        )
      );
    });

    socket.on("originalStateUpdated", (update) => {
      setDevices((prevDevices) => {
        const updatedDevices = prevDevices.map((device) =>
          device.deviceId === update.deviceId
            ? {
                ...device,
                totalOnTime: update.totalOnTime,
                originalState: update.originalState,
                lastStateChange: update.lastStateChange,
              } // Update the state and last change timestamp
            : device
        );
        return updatedDevices;
      });
    });

    // Listen for electricity state updates from the server
    socket.on("electricityStateUpdated", (updatedElectricity) => {
      setElectricity(updatedElectricity.state);
    });
    socket.on("timerReset", (update) => {
      setDevices((prevDevices) => {
        const updatedDevices = prevDevices.map((device) =>
          device.deviceId === update.deviceId
            ? {
                ...device,
                totalOnTime: update.totalOnTime, // Reset the totalOnTime
                startTime: update.startTime, // Update the start time if provided
                lastStateChange: update.lastStateChange, // Optionally update if included
              }
            : device
        );
        return updatedDevices;
      });
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("stateUpdated");
      socket.off("electricityStateUpdated");
      socket.off("realTimeUpdate");
      socket.off("originalStateUpdated");
      socket.off("timerReset");
    };
  }, []);

  return (
    <div>
      <h1>Device Control</h1>
      <button onClick={() => navigate("/history")}>History</button>
      <ul>
        {devices.map((device) => (
          <li key={device.deviceId}>
            <div>
              <p>DeviceId : {device.deviceId}</p>
              <p>OriginalState : {device.originalState}</p>
              <p>TotalOntime : {formatTime(device.totalOnTime)}s</p>
              <p> StateAt PHone : {device.state}</p>
              <span> Name : {device.name}: </span>
              <button onClick={() => toggleDevice(device)}>
                {device.state}
              </button>
              <button onClick={() => handleReset(device)}>ResetTimer</button>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <p>Total Time </p>
        {formatTime(Totaltime)}
      </div>
      <div>
        <h2>Electricity</h2>
        <div>
          <span>Electricity: </span>
          {electricity}
        </div>
      </div>
    </div>
  );
};

export default App;
