"use client";

import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TopCategories = () => {
  const dispatch: AppDispatch = useDispatch();
  const rent_hire_categories = useSelector(
    (state: RootState) => state.rentHireProduct.rent_hire_categories
  );
  const categoryStatus = useSelector(
    (state: RootState) => state.rentHireProduct.status
  );
  const error = useSelector((state: RootState) => state.rentHireProduct.error);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchRentHireCategories());
  }, [dispatch]);

  if (!isClient) return null;
  if (categoryStatus === "loading") return <div>Loading...</div>;
  if (categoryStatus === "failed") return <div>Error: {error}</div>;
  if (rent_hire_categories.length === 0)
    return <div>No categories available.</div>;

  return (
    <div className="px-0">
      {/* MOBILE VIEW (List Style) */}
      <div className="block md:hidden max-w-md mx-auto bg-white rounded-lg shadow-sm">
        {/* <h2 className="text-center font-semibold text-lg py-3">Rent & Hire</h2> */}
        {rent_hire_categories.map((category, index) => (
          <React.Fragment key={category.id}>
            <Link
              href={`/rent-hire/${category.slug
                .toLowerCase()
                .replace(/ /g, "-")}/`}
              className={`flex items-center px-4 py-3 hover:bg-gray-100 transition ${
                !category.slug ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-disabled={!category.slug}
            >
              {/* Icon */}
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src={category.image}
                  alt={category.title}
                  className="w-6 h-6 object-contain"
                  width={24}
                  height={24}
                />
              </div>

              {/* Title */}
              <span className="text-gray-800 text-sm font-medium ml-3">
                {category.title}
              </span>
            </Link>

            {/* Divider Line */}
            {index !== rent_hire_categories.length - 1 && (
              <hr className="border-gray-200" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* DESKTOP VIEW (Grid Style) */}
      <div className="hidden md:grid grid-cols-3  gap-4">
        {rent_hire_categories.map((category) => (
          <Link
            href={`/rent-hire/${category.slug
              .toLowerCase()
              .replace(/ /g, "-")}/`}
            key={category.id}
            className={`flex items-center space-x-3 p-2 md:p-3 rounded-lg bg-gray-100  hover:bg-gray-200 transition
               border border-gray-300 shadow-md ${
                 !category.slug ? "cursor-not-allowed opacity-50" : ""
               }`}
            aria-disabled={!category.slug}
          >
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src={category.image}
                alt={category.title}
                className="w-10 h-10 object-contain"
                width={40}
                height={40}
              />
            </div>

            {/* Title */}
            <span className="text-gray-700 md:text-sm text-xs font-medium">
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;

// "use client";

// import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";
// import { AppDispatch, RootState } from "@/reducers/store";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const TopCategories = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const rent_hire_categories = useSelector(
//     (state: RootState) => state.rentHireProduct.rent_hire_categories
//   );
//   const categoryStatus = useSelector(
//     (state: RootState) => state.rentHireProduct.status
//   );
//   const error = useSelector((state: RootState) => state.rentHireProduct.error);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//     dispatch(fetchRentHireCategories());
//   }, [dispatch]);

//   if (!isClient) return null;
//   if (categoryStatus === "loading") return <div>Loading...</div>;
//   if (categoryStatus === "failed") return <div>Error: {error}</div>;
//   if (rent_hire_categories.length === 0)
//     return <div>No categories available.</div>;

//   return (
//     <div className="px-4 md:px-0 max-w-md mx-auto">
//       <h2 className="text-center font-semibold text-lg py-3">Rent & Hire</h2>

//       <div className="bg-white rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3">
//         {rent_hire_categories.map((category, index) => (
//           <React.Fragment key={category.id}>
//             <Link
//               href={`/rent-hire/${category.slug
//                 .toLowerCase()
//                 .replace(/ /g, "-")}/`}
//               className={`flex items-center px-4 py-3 hover:bg-gray-100 transition ${
//                 !category.slug ? "cursor-not-allowed opacity-50" : ""
//               }`}
//               aria-disabled={!category.slug}
//             >
//               {/* Icon */}
//               <div className="w-8 h-8 flex items-center justify-center">
//                 <Image
//                   src={category.image}
//                   alt={category.title}
//                   className="w-6 h-6 object-contain"
//                   width={24}
//                   height={24}
//                 />
//               </div>

//               {/* Title */}
//               <span className="text-gray-800 text-sm font-medium ml-3">
//                 {category.title}
//               </span>
//             </Link>

//             {/* Divider Line */}
//             {index !== rent_hire_categories.length - 1 && (
//               <hr className="border-gray-200" />
//             )}
//           </React.Fragment>
//         ))}

//         {/* Sticky "Explore More A to Z" Button */}
//         <div className="text-center bg-gray-100 text-gray-700 font-medium py-3">
//           Explore more A to Z
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopCategories;

// "use client";

// import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";
// import { AppDispatch, RootState } from "@/reducers/store";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const TopCategories = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const rent_hire_categories = useSelector(
//     (state: RootState) => state.rentHireProduct.rent_hire_categories
//   );
//   const categoryStatus = useSelector(
//     (state: RootState) => state.rentHireProduct.status
//   );
//   const error = useSelector((state: RootState) => state.rentHireProduct.error);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//     dispatch(fetchRentHireCategories());
//   }, [dispatch]);

//   if (!isClient) return null;
//   if (categoryStatus === "loading") return <div>Loading...</div>;
//   if (categoryStatus === "failed") return <div>Error: {error}</div>;
//   if (rent_hire_categories.length === 0)
//     return <div>No categories available.</div>;

//   return (
//     <div className="px-4 md:px-0">
//       {/* Search Bar */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search All Category"
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
//         />
//       </div>

//       {/* Categories Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//         {rent_hire_categories.map((category) => (
//           <Link
//             href={`/rent-hire/${category.slug
//               .toLowerCase()
//               .replace(/ /g, "-")}/`}
//             key={category.id}
//             className={`flex items-center space-x-3 p-2 md:p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition
//               border border-gray-300 shadow-md
//               ${!category.slug ? "cursor-not-allowed opacity-50" : ""}`}
//             aria-disabled={!category.slug}
//           >
//             {/* Icon */}
//             <div className="w-12 h-12 flex items-center justify-center">
//               <Image
//                 src={category.image}
//                 alt={category.title}
//                 className="w-10 h-10 object-contain"
//                 width={40}
//                 height={40}
//               />
//             </div>

//             {/* Title */}
//             <span className="text-gray-700 md:text-sm text-xs font-medium">
//               {category.title}
//             </span>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TopCategories;
