"use client";

import { CategoryCardProps } from "@/types/types";
import Image from "next/image";
import React from "react";

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image = "/assets/home/skincare.png", // Fallback to default image
  url,
}) => {
  return (
    <a
      href={url}
      className="relative w-full h-32 aspect-square rounded-lg overflow-hidden shadow-md"
    >
      {/* Background Image */}
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}

      {/* Bottom Half Shadow Overlay */}
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent">
        {/* Text at the Very Bottom */}
        <p className="absolute bottom-2 mb-0 inset-x-0 text-center text-[10px] text-white ">
          {name}
        </p>
      </div>
    </a>
  );
};

export default CategoryCard;

// "use client";

// import { CategoryCardProps } from "@/types/types";
// import Image from "next/image";
// import React from "react";

// const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, url }) => {
//   return (
//     <a
//       href={url}
//       className="relative w-full h-32 aspect-square rounded-lg overflow-hidden shadow-md"
//     >
//       {/* Background Image */}
//       <Image src={image} alt={name} fill className="object-cover" />

//       {/* Bottom Half Shadow Overlay */}
//       <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent">
//         {/* Text at the Very Bottom */}
//         <p className="absolute bottom-2 mb-0 inset-x-0 text-center text-[10px] text-white ">
//           {name}
//         </p>
//       </div>
//     </a>
//   );
// };

// export default CategoryCard;
