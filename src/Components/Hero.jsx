import React from "react";
import hero from "../assets/Hero.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="relative">
        <img src={hero} alt="" className="w-full h-auto object-cover" />
        <div className="absolute top-1/3 left-0 p-4 text-2xl bg-gradient-to-r from-gray-500 to-transparent rounded-xl md:top-1/2 md:p-8 md:text-3xl lg:p-12 lg:text-4xl">
          <h1 className="text-white">Trusted Matrimony and</h1>
          <h1 className="text-rose-600">Matchmaking Service.....</h1>
        </div>
      </div>
    </div>
  );
}
