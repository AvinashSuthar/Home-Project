import React from "react";

const Motor = ({ motor }) => {
  return (
    <div>
      Motor
      <div>
        <span>{motor.name}: </span>
        <button onClick={() => toggleDevice(motor)}>
          {motor.state} (ON Time: {motor.state}s)
        </button>
      </div>
    </div>
  );
};

export default Motor;
