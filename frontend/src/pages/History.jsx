import React, { useEffect, useState } from "react";
import axios from "axios";
import formatTime from "../utils/formatTime";

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
    <div>
      {history.map((item, index) => (
        <div key={index}>
          <p>Device ID: {item.deviceId}</p>
          <p>Total Time: {formatTime(item.totaltime)}</p>
          <p>Total Time: {formatTimestampIST(item.resetTime)}</p>
          <hr />
        </div>
      ))}
    </div>
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
