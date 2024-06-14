import React from "react";
import fb from "../assets/Facebook.png";
import insta from "../assets/Instagram.png";
import twit from "../assets/Twitter.png";
import linked from "../assets/LinkedIn.png";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function Footer() {
  return (
    <div className="container mx-auto px-4">
      <div className="top flex flex-col lg:flex-row justify-between items-center py-10">
        <h1 className="text-2xl lg:text-3xl">LOGO</h1>
        <div className="input flex mt-4 lg:mt-0">
          <input
            type="text"
            placeholder="Subscribe Newsletter"
            className="p-2 rounded-l border border-gray-300"
          />
          <AiOutlineArrowRight className="bg-rose-500 w-10 h-10 text-white p-2 rounded-r cursor-pointer" />
        </div>
      </div>
      <div className="anchors flex flex-wrap justify-center lg:justify-between py-2">
        <a href="#" className="text-lg lg:text-xl mx-2 my-1 lg:my-0">
          Blogs
        </a>
        <a href="#" className="text-lg lg:text-xl mx-2 my-1 lg:my-0">
          Career
        </a>
        <a href="#" className="text-lg lg:text-xl mx-2 my-1 lg:my-0">
          Achievements
        </a>
        <a href="#" className="text-lg lg:text-xl mx-2 my-1 lg:my-0">
          Terms of Use
        </a>
        <a href="#" className="text-lg lg:text-xl mx-2 my-1 lg:my-0">
          Help
        </a>
        <a href="#" className="text-lg lg:text-xl mx-2 my-1 lg:my-0">
          Contact Us
        </a>
      </div>
      <div className="socials flex justify-center lg:justify-between py-4">
        <img
          src={fb}
          alt="Facebook"
          className="bg-slate-300 p-2 rounded mx-2"
        />
        <img
          src={insta}
          alt="Instagram"
          className="bg-slate-300 p-2 rounded mx-2"
        />
        <img
          src={linked}
          alt="LinkedIn"
          className="bg-slate-300 p-2 rounded mx-2"
        />
        <img
          src={twit}
          alt="Twitter"
          className="bg-slate-300 p-2 rounded mx-2"
        />
      </div>
      <div className="copyright flex justify-center text-center bg-red-100 py-4">
        <span className="text-sm lg:text-base">
          Copyrights reserved &copy; Bantu Programmers
        </span>
      </div>
    </div>
  );
}
