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
    <div className="w-full px-4 py-4">
      <div className="relative h-4 mt-8">
        {/* Track */}
        <div className="absolute w-full h-2 bg-gray-300 rounded-full"></div>

        {/* Filled area */}
        <div
          className="absolute h-2 bg-orange-400 rounded-full"
          style={{
            left: `${((lowValue - min) / (max - min)) * 100}%`,
            width: `${((highValue - lowValue) / (max - min)) * 100}%`,
          }}
        ></div>

        {/* Invisible range inputs */}
        <input
          type="range"
          min={min}
          max={max}
          value={lowValue}
          onChange={handleLowChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: lowValue === highValue ? 1 : 2 }} // Adjust zIndex to allow both sliders to be movable
        />
        <input
          type="range"
          min={min}
          max={max}
          value={highValue}
          onChange={handleHighChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: lowValue === highValue ? 2 : 1 }} // Adjust zIndex to allow both sliders to be movable
        />

        {/* Handles */}
        <div
          className="absolute w-3 h-8 bg-white border-2 border-orange-400 rounded-md shadow-md transition-transform transform hover:scale-110"
          style={{
            left: `calc(${((lowValue - min) / (max - min)) * 100}% - 0.625rem)`,
            top: '-1.25rem',
            zIndex: 3,
          }}
        ></div>
        <div
          className="absolute w-3 h-8 bg-white border-2 border-orange-400 rounded-md shadow-md transition-transform transform hover:scale-110"
          style={{
            left: `calc(${((highValue - min) / (max - min)) * 100}% - 0.625rem)`,
            top: '-1.25rem',
            zIndex: 3,
          }}
        ></div>
      </div>

      {/* Value indicators */}
      <div className="relative mt-6 text-sm text-gray-800 font-semibold">
        <span className="absolute left-0">{lowValue}</span>
        <span className="absolute right-0">{highValue}</span>
      </div>
    </div>
  );
};

export default DualSlider;
