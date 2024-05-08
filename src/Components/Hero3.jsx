import React from "react";
import hero3 from "../assets/hero3.png";

export default function Hero3() {
  return (
    <div className="container flex bg-red-100 ">
      <div className="left p-20 my-5 basis-1/2 border-r-4 border-rose-500 ">
        <div className="info flex flex-col p-20 ">
          <span className="text-7xl">Introducing</span>
          <span className="text-7xl text-rose-500">BantuBiye</span>
          <span className="text-7xl">Meet!</span>
        </div>
      </div>
      <div className="right basis-1/2 px-20 py-10">
        <img src={hero3} alt="" />
      </div>
    </div>
  );
}
