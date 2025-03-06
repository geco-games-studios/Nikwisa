import Image from "next/image";
import React from "react";

const PhotographyAd = () => {
  return (
    <div className="flex items-center justify-between bg-[#8b2e20]  text-white p-4  md:p-8 rounded-lg my-8 h-40 md:h-64 lg:h-80">
      {/* Left Content (Text) */}
      <div className="flex-1 px-2 sm:px-4 ">
        <h1 className="text-sm  md:text-6xl font-bold leading-4">
          Choose the Best Photographers
        </h1>
        <p className=" text-xs md:text-xl text-[#f7ddc4] leading-3">
          to capture your special moments!!
        </p>
        <button className="mt-0 md:mt-4 bg-[#f7dd04] text-[#8b2e20] font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-lg md:text-xl hover:bg-[#e5c003]">
          EXPLORE NOW
        </button>
      </div>

      {/* Right Content (Image) */}
      <div className="flex-1 px-2 sm:px-4">
        <Image
          src="/assets/home/weddingPhoto.png"
          alt="Couple"
          className="rounded-lg w-full h-auto max-h-[150px] sm:max-h-[300px] object-cover"
          width={150} // Set appropriate width
          height={150} // Set appropriate height
        />
      </div>
    </div>
  );
};

export default PhotographyAd;
