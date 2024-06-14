import React from "react";
import Slider from "./Slider";

export default function Reviews() {
  return (
    <div className="container mx-auto flex flex-col md:flex-row px-4 md:px-20 py-10 md:py-20">
      <div className="basis-full md:basis-2/3 md:border-r-4 md:border-cyan-500 md:rounded-lg md:pr-10 mb-8 md:mb-0">
        <Slider />
        <button className="flex justify-center items-center text-center bg-cyan-600 text-lg md:text-2xl py-2 md:py-3 w-full rounded text-white hover:shadow-xl duration-300">
          View All
        </button>
      </div>
      <div className="basis-full md:basis-1/3 md:pl-10">
        <div className="info flex flex-col">
          <span className="text-3xl md:text-5xl lg:text-7xl">
            Matrimonial service
          </span>
          <span className="text-3xl md:text-5xl lg:text-7xl text-rose-500">
            with Millions
          </span>
          <span className="text-3xl md:text-5xl lg:text-7xl">
            of success stories....
          </span>
        </div>
      </div>
    </div>
  );
}
