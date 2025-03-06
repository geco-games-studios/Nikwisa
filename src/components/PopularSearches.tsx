"use client";

import Image from "next/image";
import React, { useState } from "react";

const PopularSearches = () => {
  const searches = [
    {
      id: 1,
      title: "Construction Companies",
      image: "/assets/home/1.png",
    },
    { id: 2, title: "Car Rental", image: "/assets/home/2.png" },
    { id: 3, title: "Beauty Parlours", image: "/assets/home/3.png" },
    {
      id: 4,
      title: "Mobile Phone Dealers",
      image: "/assets/home/4.png",
    },
    { id: 5, title: "Cosmetics", image: "/assets/home/5.png" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width); // Calculate the active slide
    setActiveIndex(index);
  };
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Popular Searches
      </h2>
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-6 gap-4">
        {searches.map((item) => (
          <div
            key={item.id}
            className="bg-[#F2E5D4] shadow-md rounded-lg overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-64">
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority
                className="rounded-t-lg"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between items-center">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                {item.title}
              </h3>
              <button className="mt-auto bg-white text-[#D1B898] text-sm font-semibold py-2 px-4 rounded-md hover:bg-yellow-500">
                Enquire Now
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile Scrollable */}
      <section>
        {/* Carousel */}
        <div
          className="flex md:hidden gap-4 overflow-x-scroll scrollbar-hide"
          onScroll={handleScroll} // Update the active slide on scroll
        >
          {searches.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-1/3 bg-[#F2E5D4] shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-24">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between items-center">
                <h3 className="text-[8px] text-center font-medium text-gray-800 mb-2">
                  {item.title}
                </h3>
                <button className="mt-auto bg-white text-[#D1B898] text-[8px] font-semibold py-1 px-4 rounded-md">
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="mt-2 flex justify-center items-center gap-2">
          {searches.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeIndex ? "bg-[#D1B898]" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </section>
    </section>
  );
};
export default PopularSearches;
