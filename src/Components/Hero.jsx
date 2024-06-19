import React from "react";
import hero from "../assets/Hero.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <img src={hero} alt="Hero" className="w-full h-screen object-cover" />
{/* 
      <div className="absolute top-0 left-0 p-4 text-xl md:p-8 md:text-2xl lg:p-12 lg:text-3xl">
        YV
      </div> */}

      {/* <div className="absolute top-0 right-0 flex flex-col items-end md:flex-row md:items-center p-4 md:p-8 lg:p-12 space-y-2 md:space-y-0 md:space-x-4 lg:space-x-8">
        <button
          onClick={() => navigate("/login")}
          className="bg-cyan-600 text-white px-4 py-2 rounded-br-xl rounded-tl-xl md:px-6 md:py-3 lg:px-8 lg:py-4 lg:text-xl"
        >
          Login
        </button>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-br-xl rounded-tl-xl md:px-6 md:py-3 lg:px-8 lg:py-4 lg:text-xl">
          Help
        </button>
      </div> */}

     <div className="absolute top-2/3 left-10 p-4 pl-8 text-2xl bg-gradient-to-r from-gray-500 to-transparent rounded-xl md:top-1/2 md:p-8 md:text-3xl lg:p-12 lg:text-4xl">
        <h1 className="text-white">Trusted Matrimony and</h1>
        <h1 className="text-rose-600">Matchmaking Service.....</h1>
      </div>
    </div>
  );
}
