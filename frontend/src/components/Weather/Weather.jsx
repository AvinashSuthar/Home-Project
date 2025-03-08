import React, { useState } from "react";

const WeatherApp = () => {
  const apiKey = "a0c1437a7b9199ff34d82b620998251c";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  const checkWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
      if (!response.ok) {
        setError(true);
        setWeather(null);
        return;
      }
      const data = await response.json();
      setWeather(data);
      setError(false);
    } catch (err) {
      setError(true);
      setWeather(null);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-900 shadow-md flex flex-col items-center">
      {/* Search Box */}
      <div className="w-full max-w-2xl flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={checkWeather} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">City not found. Try again.</p>}

      {/* Weather Info */}
      {weather && (
        <div className="mt-3 flex items-center space-x-4 bg-gray-800 p-3 rounded-lg shadow-md text-white">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="w-12"
          />
          <div>
            <h2 className="text-lg font-semibold">{weather.name}</h2>
            <p className="text-gray-400">{weather.weather[0].description}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">{Math.round(weather.main.temp)}°C</p>
            <p className="text-xs text-gray-400">
              💨 {weather.wind.speed} km/h | 💧 {weather.main.humidity}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
