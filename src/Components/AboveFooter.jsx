import React from "react";
import love4 from "../assets/love4.png";
import love5 from "../assets/love5.png";
import love6 from "../assets/love6.png";

export default function AboveFooter() {
  return (
    <>
      <div className="flex flex-col px-4 py-10 justify-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl">LOGO</h1>
        <p className="text-base sm:text-lg md:text-xl mt-4">
          In today's world, finding a partner can be difficult. There are so
          many options for singles to choose from and they all seem alike! That
          is why BantuBiye was founded with the goal of making your search
          easier. We want you to find happiness. BantuBiye is India's No.1
          Matchmaking Service, founded with a simple objective - to help people
          find happiness and love in their lives. BantuBiye has helped more than
          a million Indian couples marry each other.
        </p>
      </div>
      <div className="banner flex flex-col lg:flex-row gap-4 lg:gap-40 justify-center bg-slate-100 py-6 border-b-2 border-slate-300">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-white bg-cyan-600 px-4 py-2 rounded">
          Trusted by Millions
        </h1>
        <div className="ban flex flex-col sm:flex-row gap-4 lg:gap-20 justify-center items-center">
          <div className="one flex flex-col justify-center text-center items-center">
            <img src={love4} alt="" className="w-12 sm:w-16 md:w-20" />
            <p className="text-sm sm:text-lg md:text-xl mt-2">Best Matches</p>
          </div>
          <div className="two flex flex-col justify-center text-center items-center">
            <img src={love5} alt="" className="w-12 sm:w-16 md:w-20" />
            <p className="text-sm sm:text-lg md:text-xl mt-2">
              Verified Profile
            </p>
          </div>
          <div className="three flex flex-col justify-center text-center items-center">
            <img src={love6} alt="" className="w-12 sm:w-16 md:w-20" />
            <p className="text-sm sm:text-lg md:text-xl mt-2">100% Privacy</p>
          </div>
        </div>
      </div>
    </>
  );
}
