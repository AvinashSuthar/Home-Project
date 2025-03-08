import React from 'react';

function Device({ device, toggleDevice, handleReset, formatTime }) {
  return (
    <li 
      key={device.deviceId} 
      className="bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 transition-transform hover:scale-105 hover:shadow-xl"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 tracking-wide">
          {device.name || "Unknown Device"}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p className="text-gray-400">
            <span className="font-medium text-gray-300">Device ID:</span> {device.deviceId}
          </p>
          <p className="text-gray-400">
            <span className="font-medium text-gray-300">Original State:</span> {device.originalState}
          </p>
          <p className="text-gray-400">
            <span className="font-medium text-gray-300">Total On Time:</span> {formatTime(device.totalOnTime)}s
          </p>
          <p className="text-gray-400">
            <span className="font-medium text-gray-300">State at Phone:</span> {device.state}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* ON/OFF Toggle Button */}
          {device.state === "ON" ? (
            <button 
              onClick={() => toggleDevice(device)} 
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-red-400 to-red-600 shadow-lg hover:shadow-green-500/50 hover:from-green-500 hover:to-green-700 transition-all transform hover:scale-105"
            >
              Turn OFF
            </button>
          ) : (
            <button 
              onClick={() => toggleDevice(device)} 
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-green-400 to-green-600  shadow-lg hover:shadow-red-500/50 hover:from-red-500 hover:to-red-700 transition-all transform hover:scale-105"
            >
              Turn ON
            </button>
          )}

          {/* Reset Timer Button */}
          <button 
            onClick={() => handleReset(device)} 
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white text-sm shadow-md transition-all transform hover:scale-105"
          >
            Reset Timer
          </button>
        </div>
      </div>
    </li>
  );
}

export default Device;
