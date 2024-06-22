import React from "react";
import { useNavigate } from "react-router-dom";
import shadi2 from "../assets/shadi2.png";

export default function Reviews() {
  const navigate = useNavigate();

  return (
    <>
      <div className= "w-full flex flex-col sm:flex-row px-5 md:px-20 py-10 md:py-20 bg-red-100">
        <div className="left w-full md:w-2/3 border-r-0 md:border-r-4 border-rose-500 px-10 py-10">
          <div className="info flex flex-col text-center md:text-left items-center">
            <span className="text-4xl md:text-7xl text-cyan-500">
              Search by Different Aspects
            </span>
            <img
              src={shadi2}
              alt="shadi2"
              className="w-full h-auto pt-10 rounded-lg"
            />
          </div>
        </div>
        <div className="right w-full md:w-2/3 px-5 md:px-10">
          <div className="section">
            <h1 className="text-3xl md:text-5xl py-3">By Mother Tongue</h1>
            <div className="buttons flex flex-wrap gap-3 md:gap-5 py-3 border-t-2 border-cyan-400 border-dotted">
              <button
                onClick={() =>
                  navigate("/matri", { state: { language: "bengali" } })
                }
                className="w-full md:w-2/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
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
                className="w-full md:w-2/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
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
                className="w-full md:w-2/5 bg-white text-xl md:text-3xl px-3 py-2 rounded hover:shadow-xl duration-300"
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
    </>
  );
}
