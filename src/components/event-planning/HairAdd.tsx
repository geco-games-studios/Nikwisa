import Image from "next/image";
import React from "react";

const HairAdd = () => {
  return (
    <section className="relative w-full h-40 md:h-64 lg:h-80 overflow-hidden my-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/home/hairBg.png"
          alt="Hair Dresser Banner"
          className="w-full h-full object-cover"
          width={150} // Set appropriate width
          height={150} // Set appropriate height
        />
      </div>

      {/* Overlay with Right-Aligned Text */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
        <div className="flex justify-end w-full h-full">
          <div className="text-left text-white p-4 md:p-8 lg:p-12 w-1/2 flex flex-col justify-center">
            <h1 className="text-xs md:text-2xl lg:text-4xl font-bold mb-4 leading-tight">
              Find the Best Hair Dressers <br /> for you and your Bridesmaids
            </h1>
            <button className="bg-black text-white font-semibold py-2 px-4 mt-4 rounded-md hover:bg-white hover:text-black transition">
              Explore Now &gt;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HairAdd;
