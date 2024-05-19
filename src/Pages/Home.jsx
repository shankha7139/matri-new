import React from "react";
import Hero2 from "../Components/Hero2";
import Hero3 from "../Components/Hero3";
import Reviews from "../Components/Reviews";
import Selector from "../Components/Selector";
import AboveFooter from "../Components/AboveFooter";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Hero />
      <Hero2 />
      <Hero3 />
      <Reviews />
      <div className="getstarted flex gap-10 bg-rose-500 px-60 py-5 my-5 ">
        <p className="text-white text-5xl">Your Story is waiting to Happen</p>
        <button
          onClick={() => navigate("/all-matri")}
          className="text-white text-5xl bg-cyan-700 px-5 py-2 rounded-br-xl rounded-tl-xl "
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
