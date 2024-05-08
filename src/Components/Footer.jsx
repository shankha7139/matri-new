import React from "react";
import fb from "../assets/Facebook.png";
import insta from "../assets/Instagram.png";
import twit from "../assets/Twitter.png";
import linked from "../assets/LinkedIn.png";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function Footer() {
  return (
    <div>
      <div className="top flex justify-between px-40 py-10 ">
        <h1>LOGO</h1>
        <div className="input flex ">
          <input type="text" placeholder="Subscribe Newsletter" />
          <AiOutlineArrowRight className="bg-rose-500 w-10 h-10  hover:text-white shadow-xl duration-300 cursor-pointer " />
        </div>
      </div>
      <div className="anchors flex justify-between px-40 py-2 ">
        <a href="" className="text-xl">
          Blogs
        </a>
        <a href="" className="text-xl">
          Career
        </a>
        <a href="" className="text-xl">
          Achievments
        </a>
        <a href="" className="text-xl">
          Terms of Use
        </a>
        <a href="" className="text-xl">
          Help
        </a>
        <a href="" className="text-xl">
          Contact Us
        </a>
      </div>
      <div className="socials flex justify-between px-40 py-2 ">
        <img src={fb} alt="" className="bg-slate-300 p-2 rounded " />
        <img src={insta} alt="" className="bg-slate-300 p-2 rounded " />
        <img src={linked} alt="" className="bg-slate-300 p-2 rounded " />
        <img src={twit} alt="" className="bg-slate-300 p-2 rounded " />
      </div>
      <div className="copyright flex justify-center text-center bg-red-100  ">
        <span>Copyrights reserved &copy; Bantu Programmers</span>
      </div>
    </div>
  );
}
