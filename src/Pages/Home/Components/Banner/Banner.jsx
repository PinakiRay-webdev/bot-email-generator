import React from "react";
import BannerImage from "../../../../assets/Banner.png";
const Banner = () => {
  return (
    <div className="w-full h-fit">
      <div className="px-12 h-[90vh]">
        <section className="flex flex-col items-center my-12 px-4">
        <h1
          className="text-center text-4xl sm:text-5xl lg:text-7xl font-extrabold whitespace-nowrap"
        >
          All your <span className="bg-[#C9B9FF] inline-block">customer</span>
          <br />
          <span className="bg-[#C9B9FF] inline-block">insights</span> in one place.
        </h1>
        <p className="sm:my-10 my-5 text-sm sm:text-lg">
          Analyze customer data. Manage and share insights. Build products
          people love.
        </p>
        <div className="buttons flex gap-3 items-center">
          <button
            className="ring-2 ring-[#190041] bg-[#190041] text-white rounded font-semibold px-3 py-1 sm:px-6 sm:py-2 sm:text-sm text-xs"
          >
            Try for free
          </button>
          <button
            className="ring-2 ring-[#190041] rounded font-semibold px-3 py-1 sm:px-6 sm:py-2 sm:text-sm text-xs relative"
          >
            <span
              className="bg-indigo-700 w-3 h-3 rounded-full block absolute top-[-0.4rem] right-[-0.4rem] animate-ping"
            ></span>
            Contact sales
          </button>
        </div>
        </section>
        <section className="flex justify-center" >
          <img className="w-[85vw]" src={BannerImage} alt="" />
        </section>
      </div>
    </div>
  );
};

export default Banner;
