import React, { useState, useEffect } from "react";

const DualSlider = ({ min, max, onChange }) => {
  const [lowValue, setLowValue] = useState(min);
  const [highValue, setHighValue] = useState(max);

  useEffect(() => {
    onChange({ low: lowValue, high: highValue });
  }, [lowValue, highValue, onChange]);

  const handleLowChange = (e) => {
    const value = Math.min(Number(e.target.value), highValue - 1);
    setLowValue(value);
  };

  const handleHighChange = (e) => {
    const value = Math.max(Number(e.target.value), lowValue + 1);
    setHighValue(value);
  };

  return (
    <div className="w-full">
      <div className="relative h-2">
        <div className="absolute w-full h-2 bg-gray-200 rounded-md"></div>
        <div
          className="absolute h-2 bg-blue-500 rounded-md"
          style={{
            left: `${((lowValue - min) / (max - min)) * 100}%`,
            width: `${((highValue - lowValue) / (max - min)) * 100}%`,
          }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          value={lowValue}
          onChange={handleLowChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={highValue}
          onChange={handleHighChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
      <div className="relative mt-6">
        <span className="absolute left-0">{lowValue}</span>
        <span className="absolute right-0">{highValue}</span>
      </div>
    </div>
  );
};

export default DualSlider;
