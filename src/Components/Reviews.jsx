import React from "react";
import Slider from "./Slider";

export default function Reviews() {
  return (
    <div className="container flex  px-40 py-20 ">
      <div className="left basis-2/3 border-r-4 border-cyan-500 border-rounded px-5 ">
        <Slider />
        <button className="flex justify-center text-center bg-cyan-600 text-2xl w-[100%] py-3 rounded text-white hover:shadow-xl duration-300 ">
          View All
        </button>
      </div>
      <div className="right basis-1/3 pl-20 ">
        <div className="info flex flex-col ">
          <span className="text-7xl">Matrimonial service</span>
          <span className="text-7xl text-rose-500">with Millions</span>
          <span className="text-7xl">of success stories....</span>
        </div>
      </div>
    </div>
  );
}
