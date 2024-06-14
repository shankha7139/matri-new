import React from "react";
import Hero2 from "../Components/Hero2";
import Hero3 from "../Components/Hero3";
import Reviews from "../Components/Reviews";
import Selector from "../Components/Selector";
import AboveFooter from "../Components/AboveFooter";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import Header from "../Components/header";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Hero />
      <Hero2 />
      <Hero3 />
      <Reviews />
      <div className="getstarted flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 bg-rose-500 px-4 md:px-20 py-5 my-5">
        <p className="text-2xl md:text-4xl lg:text-5xl text-white text-center md:text-left">
          Your Story is waiting to Happen
        </p>
        <button
          onClick={() => navigate("/all-matri")}
          className="text-lg md:text-2xl lg:text-5xl bg-cyan-700 text-white px-4 md:px-8 py-2 md:py-4 rounded-br-xl rounded-tl-xl"
        >
          Get started
        </button>
      </div>
      <Selector />
      <AboveFooter />
      <Footer />
    </>
  );
}
