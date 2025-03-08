import React, { useState, useEffect } from 'react';

function Device({ device, toggleDevice, handleReset, formatTime }) {
  const [editing, setEditing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timerSet, setTimerSet] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isPaused, setIsPaused] = useState(false); // Track paused state

  useEffect(() => {
    let interval;

    if (timerSet && remainingTime > 0 && device.state === "ON") {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            stopPump();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerSet, remainingTime, device.state]);

  const handleTimer = () => {
    setEditing(true);
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60;
    setTimerSeconds(totalSeconds);
  };

  const handleTimerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://sutharagriculture.onrender.com/devices/stopwatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: device.deviceId, stopwatch: timerSeconds }),
      });

      if (response.ok) {
        alert("Timer set successfully!");
        setTimerSet(true);
        setRemainingTime(timerSeconds);
      } else {
        alert("Failed to set timer.");
      }
    } catch (error) {
      alert("Error connecting to server.");
    }

    setLoading(false);
    setEditing(false);
  };

  // Stop pump (toggle device) when timer reaches 0
  const stopPump = () => {
    toggleDevice(device);
    setTimerSet(false);
    setRemainingTime(null);
  };

  // Handle device toggle (pause/resume timer)
  const handleToggleDevice = () => {
    toggleDevice(device);

    if (device.state === "ON") {
      // If turning OFF → Pause the timer
      setIsPaused(true);
    } else {
      // If turning ON again → Resume the timer
      setIsPaused(false);
    }
  };

  return (
    <li className="bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 transition-transform hover:scale-105 hover:shadow-xl w-1/3">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 tracking-wide">{device.deviceId || "Unknown Device"}</h3>

        <div className='flex justify-between'>
          <button 
            onClick={handleToggleDevice} 
            className={`px-6 py-2 rounded-lg font-semibold text-sm text-white shadow-lg transition-all transform hover:scale-105 ${
              device.state === "ON" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {device.state}
          </button>

          <div className={`w-5 h-5 rounded-full border border-white ${device.originalState === "ON" ? "bg-green-500" : "bg-red-500"}`}></div>
        </div>

        <p className="text-gray-400">
          <span className="font-medium text-gray-300 w-full">{timerSet ? "Time Remaining: " : "Total on Time: "}</span> 
          {formatTime(remainingTime ?? device.totalOnTime)}s
        </p>

        <div className="flex justify-evenly items-center mt-4">
          {!timerSet ? (
            <button 
              onClick={handleTimer} 
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white text-sm shadow-md transition-all transform hover:scale-105"
            >
              Set Timer
            </button>
          ) : (
            <button 
              onClick={stopPump} 
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-white text-sm shadow-md transition-all transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Stopping..." : "Stop Timer"}
            </button>
          )}

          <button 
            onClick={() => {
              handleReset(device);
              setTimerSet(false);
              setRemainingTime(null);
              setIsPaused(false);
            }} 
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white text-sm shadow-md transition-all transform hover:scale-105"
          >
            Reset Timer
          </button>
        </div>

        {editing && !timerSet && (
          <form onSubmit={handleTimerSubmit} className="max-w-[10rem] mx-auto mt-4">
            <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-200">
              Set Timer:
            </label>
            <input
              type="time"
              id="time"
              onChange={handleTimeChange}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
            <button 
              type="submit" 
              className="mt-2 w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-white text-sm shadow-md transition-all transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Setting..." : `Start Timer (${timerSeconds} sec)`}
            </button>
          </form>
        )}
      </div>
    </li>
  );
}

export default Device;
