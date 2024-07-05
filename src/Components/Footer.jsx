import React from "react";
import { motion } from "framer-motion";
import fb from "../assets/Facebook.png";
import insta from "../assets/Instagram.png";
import twit from "../assets/Twitter.png";
import linked from "../assets/LinkedIn.png";
import { AiOutlineArrowRight } from "react-icons/ai";
import logo from "../assets/Logo.png";

const SocialIcon = ({ src, alt }) => (
  <motion.img
    src={src}
    alt={alt}
    className="w-10 h-10 p-2 rounded-full bg-indigo-100 hover:bg-[#F39C3E] transition-colors duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  />
);

export default function Footer() {
  return (
    <footer className="bg-white w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="top flex flex-col md:flex-row justify-between py-10 items-center border-b border-indigo-100">
          <motion.img
            className="mb-6 md:mb-0 h-16 w-auto"
            src={logo}
            alt="Logo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <div className="input flex w-full md:w-auto">
            <input
              type="text"
              placeholder="Subscribe Newsletter"
              className="w-full md:w-64 border-2 border-indigo-100 p-2 rounded-l-full focus:outline-none focus:border-[#F39C3E]"
            />
            <motion.button
              className="bg-[#F39C3E] w-12 h-12 flex items-center justify-center rounded-r-full hover:bg-indigo-100 hover:text-[#F39C3E] transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AiOutlineArrowRight className="text-white text-xl" />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-8">
          <div className="anchors flex flex-wrap justify-center md:justify-start space-x-6 mb-6 md:mb-0">
            <motion.a
              href="#"
              className="text-lg text-gray-600 hover:text-[#F39C3E] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Use
            </motion.a>
            <motion.a
              href="#"
              className="text-lg text-gray-600 hover:text-[#F39C3E] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Help
            </motion.a>
            <motion.a
              href="#"
              className="text-lg text-gray-600 hover:text-[#F39C3E] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Contact Us
            </motion.a>
          </div>
          <div className="socials flex space-x-4">
            <SocialIcon src={fb} alt="Facebook" />
            <SocialIcon src={insta} alt="Instagram" />
            <SocialIcon src={linked} alt="LinkedIn" />
            <SocialIcon src={twit} alt="Twitter" />
          </div>
        </div>
      </div>

      <div className="copyright bg-indigo-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gray-600">
            Copyrights reserved &copy; Bantu Programmers
          </span>
        </div>
      </div>
    </footer>
  );
}