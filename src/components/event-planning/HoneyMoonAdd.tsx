import Image from "next/image";
import React from "react";

const HoneymoonAdd = () => {
  return (
    <section className="relative w-full h-40 md:h-64 lg:h-80 overflow-hidden my-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/home/honeymoon.png"
          alt="Honeymoon Beach"
          className="w-full h-full object-cover"
          width={150} // Set appropriate width
          height={150} // Set appropriate height
        />
      </div>

      {/* Overlay with Right-Aligned Text */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
        <div className="flex justify-end w-full h-full">
          <div className="text-left text-white p-6 md:p-12 w-full lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-lg md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Planning to have a memorable <br /> honeymoon or holiday
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

export default HoneymoonAdd;
