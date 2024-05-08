import React from "react";
import playstore from "../assets/playstore.png";
import appstore from "../assets/appstore.png";
export default function () {
  return (
    <>
      <div className="container flex  px-40 py-20 bg-red-100 ">
        <div className="left basis-1/3  border-r-4 border-rose-500 px-5 py-10 ">
          <div className="info flex flex-col ">
            <span className="text-7xl">Search by</span>
            <span className="text-7xl text-cyan-500">Popular</span>
            <span className="text-7xl">Matrimonial Sites</span>
          </div>
        </div>
        <div className="right basis-2/3 px-10 ">
          <h1 className="text-5xl py-3 ">By Mother Tongue</h1>
          <div className="buttons flex gap-5 py-3 border-t-2 border-cyan-400 border-dotted ">
            <button className=" basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              Bengali
            </button>
            <button className="basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300  ">
              Hindi
            </button>
            <button className="basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              English
            </button>
            <button className="basis-2/5  bg-cyan-600 text-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              More Matrimonials
            </button>
          </div>
          <h1 className="text-5xl py-3 ">By Religion</h1>
          <div className="buttons flex gap-5 py-3 border-t-2 border-cyan-400 border-dotted ">
            <button className="basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              Hindu
            </button>
            <button className="basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              Muslim
            </button>
            <button className="basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              Christian
            </button>
            <button className=" basis-2/5 bg-cyan-600 text-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300">
              More Matrimonials
            </button>
          </div>
          <h1 className="text-5xl py-3 ">By Profession</h1>
          <div className="buttons flex gap-5 py-3 border-t-2 border-cyan-400 border-dotted ">
            <button className=" basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              Teacher
            </button>
            <button className="basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              Doctor
            </button>
            <button className="basis-1/5 bg-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300">
              Pilot
            </button>
            <button className="basis-2/5 bg-cyan-600 text-white text-3xl px-3 py-2 rounded hover:shadow-xl ease-in-out duration-300 ">
              More Matrimonials
            </button>
          </div>
        </div>
      </div>
      <div className="apps flex justify-center align-center py-2 pt-3 gap-3 bg-slate-100 ">
        <h1 className="text-5xl pt-2 ">Get the Matrimony app here..</h1>
        <img
          src={playstore}
          alt="playstore"
          className="h-20  w-60 object-cover cursor-pointer hover:shadow-xl duration-300 "
        />
        <img
          src={appstore}
          alt="appstore"
          className="h-20  w-60 object-cover cursor-pointer hover:shadow-xl duration-300"
        />
      </div>
    </>
  );
}
