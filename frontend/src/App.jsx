import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatTime from "./utils/formatTime";
import Loading from "./components/loading";
import Device from "./components/Device";

const socket = io("https://sutharagriculture.onrender.com"); // Replace with your backend URL

const App = () => {
  const [devices, setDevices] = useState([]);
  const [electricity, setElectricity] = useState("OFF");
  const [loading, setLoading] = useState(true);
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
      }).finally(() => {
        setLoading(false);
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
    <div className="bg-gray-950 min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Device Control</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate("/history")}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition shadow-lg"
        >
          View History
        </button>
      </div>

      <ul className="space-y-4">
        {loading ? (
          <Loading />
        ) : (
          devices.map((device) => (
            <Device device={device} toggleDevice={toggleDevice} handleReset={handleReset} formatTime={formatTime} />
          ))
        )}
      </ul>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg text-center border border-gray-700">
        <p className="text-lg font-semibold text-gray-300">Total Time</p>
        <p className="text-2xl font-bold text-blue-400">{formatTime(Totaltime)}</p>
      </div>

      <div className="mt-6 p-6 bg-gray-900/80 backdrop-blur-xl rounded-2xl text-center border border-gray-700 shadow-xl">
  <h2 className="text-lg font-semibold text-gray-300 tracking-wide flex items-center justify-center space-x-2">
    <span>Electricity Status</span>
    <span className="text-yellow-400">
      ⚡
    </span>
  </h2>

  <div className="mt-4 flex flex-col items-center space-y-3">
    {/* Animated LED Ring */}
    <div className="relative">
      <div 
        className={`w-10 h-10 rounded-full border-4 transition-all duration-500 ${
          electricity === "ON"
            ? "border-green-400 shadow-green-500/50 animate-pulse"
            : "border-red-400 shadow-red-500/50"
        }`}
      ></div>
      
      <div 
        className={`absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
          electricity === "ON"
            ? "bg-green-400 shadow-green-500/50"
            : "bg-red-400 shadow-red-500/50"
        }`}
      ></div>
    </div>

    <span className="text-gray-300 font-semibold text-lg tracking-wide">
      {electricity === "ON" ? "Active" : "Inactive"}
    </span>
  </div>
</div>

    </div>
  );

};

export default App;
