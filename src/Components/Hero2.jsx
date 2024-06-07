import React from "react";
import love1 from "../assets/love1.png";
import love2 from "../assets/love2.png";
import love3 from "../assets/love3.png";

export default function Hero2() {
  return (
    <div className="parent flex flex-col md:flex-row px-4 md:px-20 py-10 md:py-20">
      <div className="left basis-full md:basis-2/3 border-r-4 border-cyan-500 rounded-lg px-5 py-10 md:px-10 md:py-20">
        <div className="ecliplse1 flex flex-col md:flex-row px-5 py-2 gap-5 items-center">
          <img src={love1} alt="love1" className="w-24 md:w-32" />
          <div className="info">
            <h1 className="text-2xl md:text-3xl text-cyan-500">Sign Up</h1>
            <p className="text-sm md:text-base">
              Register for free and put up your matrimony profile
            </p>
          </div>
        </div>
        <div className="ecliplse2 flex flex-col md:flex-row px-5 py-2 gap-5 items-center md:ml-20">
          <div className="info relative">
            <h1 className="absolute inset-y-0 right-0 text-2xl md:text-3xl text-cyan-500">
              Connect
            </h1>
            <p className="text-sm md:text-base mt-8 md:mt-10">
              Select & Connect with matches you like
            </p>
          </div>
          <img src={love2} alt="love2" className="w-24 md:w-32" />
        </div>
        <div className="ecliplse3 flex flex-col md:flex-row px-5 py-2 gap-5 items-center">
          <img src={love3} alt="love3" className="w-24 md:w-32" />
          <div className="info">
            <h1 className="text-2xl md:text-3xl text-cyan-500">Interact</h1>
            <p className="text-sm md:text-base">
              Become a premium member & start a conversation
            </p>
          </div>
        </div>
      </div>
      <div className="right basis-full md:basis-1/3 mt-10 md:mt-0">
        <div className="info flex flex-col p-10 md:p-20">
          <span className="text-4xl md:text-7xl">Find Your</span>
          <span className="text-4xl md:text-7xl text-cyan-500">Special</span>
          <span className="text-4xl md:text-7xl">Someone</span>
        </div>
      </div>
    </div>
  );
}