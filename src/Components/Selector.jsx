import React from "react";
import playstore from "../assets/playstore.png";
import appstore from "../assets/appstore.png";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  return (
    <>
      <div className="container mx-auto px-4 lg:px-40 py-10 lg:py-20 bg-red-100">
        <div className="left lg:basis-1/3 border-b-4 lg:border-b-0 lg:border-r-4 border-rose-500 px-5 py-5 lg:py-10">
          <div className="info flex flex-col">
            <span className="text-3xl md:text-5xl lg:text-7xl">Search by</span>
            <span className="text-3xl md:text-5xl lg:text-7xl text-cyan-500">
              Popular
            </span>
            <span className="text-3xl md:text-5xl lg:text-7xl">
              Matrimonial Sites
            </span>
          </div>
        </div>
        <div className="right lg:basis-2/3 px-5 lg:px-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl py-3">
            By Mother Tongue
          </h1>
          <div className="buttons flex flex-wrap gap-5 py-3 border-t-2 border-cyan-400 border-dotted">
            <button
              onClick={() =>
                navigate("/matri", { state: { language: "bengali" } })
              }
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Bengali
            </button>
            <button
              onClick={() =>
                navigate("/matri", { state: { language: "hindi" } })
              }
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Hindi
            </button>
            <button
              onClick={() =>
                navigate("/matri", { state: { language: "english" } })
              }
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              English
            </button>
            <button
              onClick={() => navigate("/all-matri")}
              className="flex-1 min-w-[200px] bg-cyan-600 text-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              More Matrimonials
            </button>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl py-3">By Religion</h1>
          <div className="buttons flex flex-wrap gap-5 py-3 border-t-2 border-cyan-400 border-dotted">
            <button
              onClick={() =>
                navigate("/matri", { state: { religion: "Hindu" } })
              }
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Hindu
            </button>
            <button
              onClick={() =>
                navigate("/matri", { state: { religion: "muslim" } })
              }
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Muslim
            </button>
            <button
              onClick={() =>
                navigate("/matri", { state: { religion: "christian" } })
              }
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Christian
            </button>
            <button
              onClick={() => navigate("/all-matri")}
              className="flex-1 min-w-[200px] bg-cyan-600 text-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              More Matrimonials
            </button>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl py-3">
            By Profession
          </h1>
          <div className="buttons flex flex-wrap gap-5 py-3 border-t-2 border-cyan-400 border-dotted">
            <button
              onClick={() => navigate("/matri", { state: { prof: "teacher" } })}
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Teacher
            </button>
            <button
              onClick={() => navigate("/matri", { state: { prof: "doctor" } })}
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Doctor
            </button>
            <button
              onClick={() => navigate("/matri", { state: { prof: "pilot" } })}
              className="flex-1 min-w-[120px] bg-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              Pilot
            </button>
            <button
              onClick={() => navigate("/all-matri")}
              className="flex-1 min-w-[200px] bg-cyan-600 text-white text-xl md:text-2xl lg:text-3xl px-3 py-2 rounded hover:shadow-xl transition duration-300"
            >
              More Matrimonials
            </button>
          </div>
        </div>
      </div>
      <div className="apps flex flex-col lg:flex-row items-center justify-center gap-5 py-5 bg-slate-100">
        <h1 className="text-2xl md:text-4xl lg:text-5xl text-center lg:text-left">
          Get the Matrimony app here..
        </h1>
        <img
          src={playstore}
          alt="playstore"
          className="h-16 md:h-20 w-40 md:w-60 object-cover cursor-pointer hover:shadow-xl transition duration-300"
        />
        <img
          src={appstore}
          alt="appstore"
          className="h-16 md:h-20 w-40 md:w-60 object-cover cursor-pointer hover:shadow-xl transition duration-300"
        />
      </div>
    </>
  );
}
