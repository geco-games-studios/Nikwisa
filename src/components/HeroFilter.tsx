import React from "react";
import HomeSlider from "./home/HomeSlider"; // Import HomeSlider
import HairAdd from "./event-planning/HairAdd";
import HoneymoonAdd from "./event-planning/HoneyMoonAdd";
import PhotographyAd from "./event-planning/PhotographyAdd";

const EventSlider = () => {
  // Create the array of components with keys
  const components = [
    <HairAdd key="hair-add" />,
    <HoneymoonAdd key="honeymoon-add" />,
    <PhotographyAd key="photography-ad" />,
  ];

  return (
    <section className="hidden md:flex">
      <div className="flex w-full h-2/5 gap-5 mt-10">
        {/* Pass the components array to HomeSlider */}
        <div className="flex bg-slate-800 flex-1">
          <HomeSlider components={components} />
        </div>
        <div className="flex bg-red-800 flex-1">
          {["1", "2", "3", "4"].map((item, index) => (
            <div
              key={index}
              className={`flex w-1/4 bg-slate-${300 + index * 100} rounded`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSlider;
