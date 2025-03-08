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

      <div className="w-full flex flex-wrap justify-center gap-6 p-4">
        {history.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 backdrop-blur-lg bg-opacity-50 shadow-xl rounded-2xl p-6 border border-gray-700 w-full sm:w-[48%] md:w-[32%] lg:w-[24%] transition duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center border-b border-gray-600 pb-2">
              Device Details
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col">
                <p className="text-gray-400 text-sm font-medium">Device ID</p>
                <p className="text-gray-200 bg-gray-700 rounded-lg px-4 py-2 shadow-inner">
                  {item.deviceId}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-400 text-sm font-medium">Total Time</p>
                <p className="text-gray-200 bg-gray-700 rounded-lg px-4 py-2 shadow-inner">
                  {formatTime(item.totaltime)}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-400 text-sm font-medium">Reset Time</p>
                <p className="text-gray-200 bg-gray-700 rounded-lg px-4 py-2 shadow-inner">
                  {formatTimestampIST(item.resetTime)}
                </p>
              </div>
            </div>
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
