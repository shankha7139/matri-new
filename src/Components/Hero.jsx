import React from "react";
import hero from "../assets/Hero.png";

export default function Hero() {
  return (
    <div>
      <div className="hero relative ">
        <img src={hero} alt="" />
        <div className="logo absolute top-0 left-0 mx-5 px-5 my-10 py-2 text-2xl ">
          LOGO
        </div>
        <div className="butt absolute top-0 right-0  ">
          <button className="bg-cyan-600 text-white px-5 py-2 text-xl mx-5 my-10 rounded-br-xl rounded-tl-xl ">
            Login
          </button>
          <button className="bg-rose-600 text-white px-5 py-2 text-xl mx-5 my-10 rounded-br-xl rounded-tl-xl ">
            Help
          </button>
        </div>
        <div className="banner absolute top-[32%] left-0 mx-5 px-5 my-10 py-2 text-5xl bg-gradient-to-r from-gray-500 to-transparent rounded-xl  ">
          <h1 className="text-white">Trusted Matrimony and</h1>
          <h1 className="text-rose-600">Matchmaking Service.....</h1>
        </div>
      </div>
    </div>
  );
}
