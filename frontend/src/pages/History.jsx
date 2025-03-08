import React, { useEffect, useState } from "react";
import axios from "axios";
import formatTime from "../utils/formatTime";
import Navbar from "../components/Navbar/Navbar";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://sutharagriculture.onrender.com/resetTimer/get"
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div>
        {history.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 max-w-sm mx-auto"
          >
            <p className="text-lg font-semibold text-gray-700">📌 Device ID:
              <span className="font-normal text-gray-600">{item.deviceId}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700">⏳ Total Time:
              <span className="font-normal text-gray-600">{formatTime(item.totaltime)}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700">🔄 Reset Time:
              <span className="font-normal text-gray-600">{formatTimestampIST(item.resetTime)}</span>
            </p>
            <hr className="mt-3 border-gray-300" />
          </div>

        ))}
      </div>
    </>
  );
};

const formatTimestampIST = (timestamp) => {
  const date = new Date(timestamp);

  const istDate = new Date(date.getTime());

  // Extract individual components
  const day = String(istDate.getDate()).padStart(2, "0");
  const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = istDate.getFullYear();
  const hours = String(istDate.getHours()).padStart(2, "0");
  const minutes = String(istDate.getMinutes()).padStart(2, "0");
  const seconds = String(istDate.getSeconds()).padStart(2, "0");

  // Combine into desired format
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export default History;
