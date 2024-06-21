import React from "react";
import love4 from "../assets/love4.png";
import love5 from "../assets/love5.png";
import love6 from "../assets/love6.png";
import logo from "../assets/Logo.png";

export default function AboveFooter() {
  return (
    <>
      <div className="flex flex-col px-4 py-10 justify-center items-center sm:px-10 md:px-20 lg:px-40 xl:px-60">
        <img className="mx-auto h-14 w-auto" src={logo} alt="Logo" />
        <p className="text-lg sm:text-xl lg:text-2xl text-center mt-4">
          In today's world, finding a partner can be difficult. There are so
          many options for singles to choose from and they all seem alike! That
          is why BantuBiye was founded with the goal of making your search
          easier. We want you to find happiness. BantuBiye is India's No.1
          Matchmaking Service, founded with a simple objective - to help people
          find happiness and love in their lives. BantuBiye has helped more than
          a million Indian couples marry each other.
        </p>
      </div>
      <div className="banner flex flex-col sm:flex-row items-center gap-4 sm:gap-20 justify-center bg-slate-100 py-4 sm:py-6 border-b-2 border-slate-300">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white bg-cyan-600 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-center">
          Trusted by Minions
        </h1>
        <div className="flex flex-wrap justify-center mt-4 sm:mt-0">
          <div className="flex flex-col items-center mr-4 sm:mr-8">
            <img src={love4} alt="" className="w-16 sm:w-20" />
            <p className="text-base sm:text-lg mt-2">Best Matches</p>
          </div>
          <div className="flex flex-col items-center mr-4 sm:mr-8">
            <img src={love5} alt="" className="w-16 sm:w-20" />
            <p className="text-base sm:text-lg mt-2">Verified Profiles</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={love6} alt="" className="w-16 sm:w-20" />
            <p className="text-base sm:text-lg mt-2">99.99% Privacy</p>
          </div>
        </div>
      </div>
    </>
  );
}
