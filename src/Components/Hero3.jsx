import React from "react";
import hero3 from "../assets/hero3.png";

export default function Hero3() {
  return (
    <div className="container flex flex-col lg:flex-row bg-red-100">
      <div className="left p-5 sm:p-10 md:p-20 my-5 lg:basis-1/2 border-b-4 lg:border-b-0 lg:border-r-4 border-rose-500">
        <div className="info flex flex-col p-5 sm:p-10 md:p-20">
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Introducing
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-rose-500">
            BantuBiye
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Meet!
          </span>
        </div>
      </div>
      <div className="right px-5 py-5 sm:px-10 sm:py-10 md:px-20 md:py-10 lg:basis-1/2">
        <img src={hero3} alt="" className="w-full h-auto" />
      </div>
    </div>
  );
}
