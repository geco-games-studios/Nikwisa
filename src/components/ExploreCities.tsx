"use client";

import { City } from "@/types/types";
import React from "react";

const ExploreCities: React.FC = () => {
  const TopCities: City[] = [
    {
      id: 1,
      name: "Lusaka",
      image: "/assets/home/1.png",
      url: "/banquet-hall",
    },
    {
      id: 2,
      name: "Kitwe",
      image: "/assets/home/2.png",
      url: "/banquet-hall",
    },
    {
      id: 3,
      name: "Livingstone",
      image: "/assets/home/3.png",
      url: "/banquet-hall",
    },
    {
      id: 4,
      name: "Ndola",
      image: "/assets/home/4.png",
      url: "/banquet-hall",
    },
  ];

  return (
    <section className="my-8 hidden md:block">
      {/* Cities Container */}
      <div className="border border-gray-300 rounded-lg p-4">
        {/* Title Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          Explore Top Cities{" "}
          <span className="ml-2 text-xs text-white bg-red-500 rounded-full px-2 py-1">
            NEW
          </span>
        </h2>

        {/* City Cards */}
        <div className="flex gap-6 items-center">
          {TopCities.map((city) => (
            <div
              key={city.id}
              className="flex items-center bg-white rounded-lg shadow-md overflow-hidden w-1/4 border border-gray-200"
            >
              {/* City Image */}
              <div
                className="h-40 w-2/5 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${city.image})`,
                }}
              />

              {/* City Title & Button */}
              <div className="p-4 w-3/5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {city.name.toUpperCase()}
                </h3>
                <button className="text-[#D1B898] font-semibold hover:underline">
                  Explore &rsaquo;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCities;
