import React from "react";
import playstore from "../assets/playstore.png";
import appstore from "../assets/appstore.png";
import { useNavigate } from "react-router-dom";

export default function Reviews() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container flex flex-col md:flex-row px-5 md:px-20 py-10 md:py-20 bg-red-100">
        <div className="left md:basis-1/3 border-r-0 md:border-r-4 border-rose-500 px-5 py-10">
          <div className="info flex flex-col text-center md:text-left">
            <span className="text-4xl md:text-7xl text-cyan-500">
              Search by Popular
            </span>
            <span className="text-4xl md:text-7xl">Matrimonial Sites</span>
          </div>
        </div>
        <div className="right md:basis-2/3 px-5 md:px-10">
          <div className="section">
            <h1 className="text-3xl md:text-5xl py-3">By Mother Tongue</h1>
            <div className="buttons flex flex-wrap gap-3 md:gap-5 py-3 border-t-2 border-cyan-400 border-dotted">
              <button
                onClick={() =>
                  navigate("/matri", { state: { language: "bengali" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Bengali
              </button>
              <button
                onClick={() =>
                  navigate("/matri", { state: { language: "hindi" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Hindi
              </button>
              <button
                onClick={() =>
                  navigate("/matri", { state: { language: "english" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                English
              </button>
              <button
                onClick={() => navigate("/all-matri")}
                className="w-full md:w-2/5 bg-cyan-600 text-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                More Matrimonials
              </button>
            </div>
          </div>
          <div className="section">
            <h1 className="text-3xl md:text-5xl py-3">By Religion</h1>
            <div className="buttons flex flex-wrap gap-3 md:gap-5 py-3 border-t-2 border-cyan-400 border-dotted">
              <button
                onClick={() =>
                  navigate("/matri", { state: { religion: "Hindu" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Hindu
              </button>
              <button
                onClick={() =>
                  navigate("/matri", { state: { religion: "muslim" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Muslim
              </button>
              <button
                onClick={() =>
                  navigate("/matri", { state: { religion: "christian" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Christian
              </button>
              <button
                onClick={() => navigate("/all-matri")}
                className="w-full md:w-2/5 bg-cyan-600 text-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                More Matrimonials
              </button>
            </div>
          </div>
          <div className="section">
            <h1 className="text-3xl md:text-5xl py-3">By Profession</h1>
            <div className="buttons flex flex-wrap gap-3 md:gap-5 py-3 border-t-2 border-cyan-400 border-dotted">
              <button
                onClick={() =>
                  navigate("/matri", { state: { prof: "teacher" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Teacher
              </button>
              <button
                onClick={() =>
                  navigate("/matri", { state: { prof: "doctor" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Doctor
              </button>
              <button
                onClick={() =>
                  navigate("/matri", { state: { prof: "pilot" } })
                }
                className="w-full md:w-1/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                Pilot
              </button>
              <button
                onClick={() => navigate("/all-matri")}
                className="w-full md:w-2/5 bg-cyan-600 text-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
              >
                More Matrimonials
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="apps flex flex-col items-center justify-center py-5 bg-slate-100">
        <h1 className="text-3xl md:text-5xl pb-3">Get the Matrimony app here..</h1>
        <div className="flex gap-3">
          <img
            src={playstore}
            alt="playstore"
            className="h-16 md:h-20 w-auto object-contain cursor-pointer hover:shadow-xl duration-300"
          />
          <img
            src={appstore}
            alt="appstore"
            className="h-16 md:h-20 w-auto object-contain cursor-pointer hover:shadow-xl duration-300"
          />
        </div>
      </div>
    </>
  );
}
