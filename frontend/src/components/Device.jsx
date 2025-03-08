import React from 'react';

function Device({ device, toggleDevice, handleReset, formatTime }) {
  return (
    <li 
      key={device.deviceId} 
      className="bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 transition-transform hover:scale-105 hover:shadow-xl w-1/3"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 tracking-wide">
          {device.deviceId || "Unknown Device"}
        </h3>

        <div className='flex justify-between'>
        {/* ON/OFF Toggle Button */}
        {device.state === "ON" ? (
            <button 
              onClick={() => toggleDevice(device)} 
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-green-400 to-green-600 shadow-lg transition-all transform hover:scale-105"
            >
              ON
            </button>
          ) : (
            <button 
              onClick={() => toggleDevice(device)} 
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-red-400 to-red-600 shadow-lg transition-all transform hover:scale-105"
            >
              OFF
            </button>
          )}

          <div className={`w-5 h-5 bg-red-500 rounded-full border border-white ${device.originalState == "ON" && "bg-green-500"}`}></div>
        </div>

        <div className="gap-4 text-sm py-5">
          <p className="text-gray-400">
            <span className="font-medium text-gray-300 w-full">Total On Time:</span> {formatTime(device.totalOnTime)}s
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          

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
