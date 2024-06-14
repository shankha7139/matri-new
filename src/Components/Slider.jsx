import React from "react";
import Marquee from "react-fast-marquee";
import shadi1 from "../assets/shadi1.png";

export default function Slider() {
  return (
    <div className="my-2 pb-8">
      <Marquee
        className="flex"
        gradientColor={[255, 255, 255]}
        gradientWidth={100}
      >
        {Array(3)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className="shadow-xl ml-2 flex flex-col text-center p-4 rounded-xl max-w-xs md:max-w-sm lg:max-w-md mx-auto"
            >
              <img src={shadi1} alt="" className="w-full h-auto rounded" />
              <h1 className="text-lg md:text-xl lg:text-2xl text-rose-600 mt-4">
                abc and pqr
              </h1>
              <p className="text-sm md:text-base lg:text-lg mt-2">
                I found my match on biyesadi.com in one month. Not yet married
                but going steady with him. Cheers to here. Fairy tales....
              </p>
            </div>
          ))}
      </Marquee>
    </div>
  );
}
