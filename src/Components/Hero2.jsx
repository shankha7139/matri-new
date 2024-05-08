import React from "react";
import love1 from "../assets/love1.png";
import love2 from "../assets/love2.png";
import love3 from "../assets/love3.png";

export default function Hero2() {
  return (
    <div className="parent flex flex-row px-40 py-20  ">
      <div className="left basis-2/3  border-r-4 border-cyan-500 border-rounded px-5 py-10 ">
        <div className="ecliplse1 flex flex-column px-5 py-2 gap-5 ">
          <img src={love1} alt="love1" />
          <div className="info">
            <h1 className="text-3xl text-cyan-500 "> Sign Up</h1>
            <p>Register for free and put up your matrimony profile</p>
          </div>
        </div>
        <div className="ecliplse2 flex flex-column px-5 py-2 gap-5 ml-28 ">
          <div className="info relative ">
            <h1 className="absolute inset-y-0 right-0  text-3xl text-cyan-500 ">
              Connect
            </h1>
            <p className="text-xl mt-10 ">
              Select & Connect with matches you like
            </p>
          </div>
          <img src={love2} alt="love2" />
        </div>
        <div className="ecliplse3 flex flex-column px-5 py-2 gap-5">
          <img src={love3} alt="love3" />
          <div className="info">
            <h1 className="text-3xl text-cyan-500 ">Interact</h1>
            <p className="text-xl">
              Become a premium member & start a conversation{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="right basis-1/3 ">
        <div className="info flex flex-col p-20 ">
          <span className="text-7xl">Find Your</span>
          <span className="text-7xl text-cyan-500">Special</span>
          <span className="text-7xl">Someone</span>
        </div>
      </div>
    </div>
  );
}
