"use client";

import React, { useEffect, useState } from "react";

type HomeSliderProps = {
  components: JSX.Element[]; // Array of components
};

const HomeSlider: React.FC<HomeSliderProps> = ({ components }) => {
  const [currentComponent, setCurrentComponent] = useState(0);

  useEffect(() => {
    if (!components || components.length === 0) return;
    const interval = setInterval(() => {
      setCurrentComponent((prev) => (prev + 1) % components.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [components]);

  const handleDotClick = (index: number) => {
    setCurrentComponent(index);
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Slider Section */}
      <div
        className="w-full h-full flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentComponent * 100}%)` }}
      >
        {components.map((component, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            {component}
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {components.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentComponent ? "bg-[#B8902E]" : "bg-gray-400"
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;

// "use client";

// import React, { useEffect, useState } from "react";

// type HomeSliderProps = {
//   components: JSX.Element[]; // Array of components
// };

// const HomeSlider: React.FC<HomeSliderProps> = ({ components }) => {
//   const [currentComponent, setCurrentComponent] = useState(0);

//   useEffect(() => {
//     if (!components || components.length === 0) return;
//     const interval = setInterval(() => {
//       setCurrentComponent((prev) => (prev + 1) % components.length);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [components]);

//   const handleDotClick = (index: number) => {
//     setCurrentComponent(index);
//   };

//   return (
//     <section className="bg-red-600 relative w-full md:w-1/2 h-64 overflow-hidden rounded-lg shadow m-0 p-0">
//       {/* Slider Section */}
//       <div
//         className="relative w-full h-full flex transition-transform duration-1000"
//         style={{
//           transform: `translateX(-${currentComponent * 100}%)`,
//         }}
//       >
//         {components.map((component, index) => (
//           <div
//             key={index}
//             className="w-full h-full flex-shrink-0 flex items-stretch overflow-hidden"
//           >
//             {component}
//           </div>
//         ))}
//       </div>

//       {/* Dots Navigation */}
//       <div className="absolute bottom-4 w-full flex justify-center space-x-2 z-10">
//         {components.map((_, index) => (
//           <button
//             key={index}
//             className={`w-3 h-3 rounded-full ${
//               currentComponent === index ? "bg-[#B8902E]" : "bg-gray-300"
//             }`}
//             onClick={() => handleDotClick(index)}
//           ></button>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default HomeSlider;
