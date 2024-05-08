import React from "react";
import love4 from "../assets/love4.png";
import love5 from "../assets/love5.png";
import love6 from "../assets/love6.png";

export default function AboveFooter() {
  return (
    <>
      <div className="flex flex-col px-4 py-10 justify-center text-center">
        <h1 className="text-5xl">LOGO</h1>
        <p className="text-xl">
          In today's world, finding a partner can be difficult. There are so
          many options for singles to choose from and they all seem alike! That
          is why BantuBiye was founded with the goal of making your search
          easier we want you to find happiness. BantuBiye is India's No.1
          Matchmaking Service, founded with a simple objective - to help people
          find happiness and love in their lives. BantuBiye has helped more than
          a million Indian couples marry each other.
        </p>
      </div>
      <div className="banner flex gap-40 justify-center bg-slate-100 py-2 border-b-2 border-slate-300 ">
        <h1 className="text-3xl text-white bg-cyan-600 px-3 pt-8 rounded ">
          Trusted by Millions
        </h1>
        <div className="ban flex gap-20 ">
          <div className="one flex flex-col justify-center text-center ">
            <img src={love4} alt="" className="w-20 ml-3 " />
            <p className="text-xl">Best Matches</p>
          </div>
          <div className="two">
            <img src={love5} alt="" className="w-20 ml-3 " />
            <p className="text-xl">Varified Profile</p>
          </div>
          <div className="three">
            <img src={love6} alt="" className="w-20 ml-3 " />
            <p className="text-xl">100% privacy</p>
          </div>
        </div>
      </div>
    </>
  );
}
