"use client";

import { fetchEventSubcategories } from "@/reducers/eventSlice";
import { RootState, AppDispatch } from "@/reducers/store";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

const PreEvent = () => {
  const dispatch: AppDispatch = useDispatch();

  // Retrieve event subcategories and status from the Redux store
  const { event_subcategories, status, error } = useSelector(
    (state: RootState) => state.eventProduct
  );

  useEffect(() => {
    // Fetch all event subcategories when the component mounts
    if (status === "idle") {
      dispatch(fetchEventSubcategories());
    }
  }, [dispatch, status]);

  // Filter subcategories containing "prevent"
  const filteredSubcategories = event_subcategories.filter((subcategory) =>
    subcategory.title.toLowerCase().includes("preevent")
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (filteredSubcategories.length === 0) {
    return <div>No subcategories found containing &quot;prevent&quot;.</div>;
  }

  return (
    <div className="w-full my-8">
      <section>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {filteredSubcategories[0]?.title}
          </h3>
        </div>

        {/* Grid to display categories */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSubcategories.map((subcategory) =>
            subcategory.categories?.map((category) => (
              <Link
                href={
                  category.slug
                    ? `/event-planning/${category.slug
                        .toLowerCase()
                        .replace(/ /g, "-")}/`
                    : "#"
                }
                key={category.id}
                className={`flex flex-col items-center text-center ${
                  !category.slug ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-disabled={!category.slug} // Optional: Accessibility
              >
                {/* Image Section */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-48 bg-gray-200 rounded flex items-center justify-center p-4">
                  {/* Use Image component here */}
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={100} // Specify the width of the image
                    height={100} // Specify the height of the image
                    className="w-full h-full object-contain rounded p-2"
                  />
                </div>
                {/* Name Section */}
                <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-700">
                  {category.title}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PreEvent;

// "use client";

// import {
//   fetchEventSubcategories,
//   fetchEventSubcategoryById,
// } from "@/reducers/eventSlice";
// import { RootState, AppDispatch } from "@/reducers/store";
// import Link from "next/link";
// import { useEffect } from "react";
// import Image from "next/image";
// import { useDispatch, useSelector } from "react-redux";

// const PreEvent = () => {
//   const dispatch: AppDispatch = useDispatch();

//   // Retrieve the event subcategory details from the Redux store
//   const { event_subcategory_details, status, error } = useSelector(
//     (state: RootState) => state.eventProduct
//   );
//   const { event_subcategories } = useSelector(
//     (state: RootState) => state.eventProduct
//   );

//   useEffect(() => {
//     // Fetch event subcategory with ID 3 when the component mounts
//     if (status === "idle") {
//       dispatch(fetchEventSubcategoryById(3)); // Fetching event subcategory with ID 3
//       // Fetching event subcategory with ID 3
//     }
//   }, [dispatch, status]);

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!event_subcategory_details) {
//     return <div>No details found for this subcategory.</div>;
//   }

//   console.log(
//     "event_subcategory_details",
//     event_subcategory_details.categories
//   );
//   console.log("event_subcategory", event_subcategories);
//   return (
//     <div className="w-full my-8">
//       <section>
//         {/* Header Section */}
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold text-gray-800">
//             {event_subcategory_details.title}
//           </h3>
//         </div>

//         {/* Grid to display categories */}
//         <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
//           {event_subcategory_details.categories?.map((category) => (
//             <Link
//               href={
//                 category.slug
//                   ? `/event-planning/${category.slug
//                       .toLowerCase()
//                       .replace(/ /g, "-")}/`
//                   : "#"
//               }
//               key={category.id}
//               className={`flex flex-col items-center text-center ${
//                 !category.slug ? "cursor-not-allowed opacity-50" : ""
//               }`}
//               aria-disabled={!category.slug} // Optional: Accessibility
//             >
//               {/* Image Section */}
//               <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-48 bg-gray-200 rounded-full flex items-center justify-center">
//                 <Image
//                   src={category.image}
//                   alt={category.title}
//                   className="w-full h-full object-cover rounded-md"
//                   width={80} // Adjust width as needed
//                   height={80} // Adjust height as needed
//                 />
//               </div>
//               {/* Name Section */}
//               <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-700">
//                 {category.title}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default PreEvent;

// import { preevent } from "@/data";
// import React from "react";

// const Prewedding = () => {
//   if (preevent.length === 0) {
//     return <div>No categories available.</div>;
//   }

//   // Limit the items displayed
//   const mobileItems = preevent.slice(0, 9); // Max 9 items for mobile
//   const desktopItems = preevent.slice(0, 12); // Max 12 items for desktop

//   return (
//     <div className="w-full my-8">
//       <section>
//         {/* Header Section */}
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold text-gray-800">
//             Pre Wedding Planning
//           </h3>
//         </div>

//         {/* Grid Layout */}
//         <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
//           {desktopItems.map((item, index) => (
//             <div
//               key={item.id}
//               className={`flex flex-col items-center text-center ${
//                 index >= 9 ? "hidden lg:flex" : ""
//               }`} // Hide extra items on mobile
//             >
//               {/* Image Section */}
//               <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-48">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-full h-full object-cover rounded-md"
//                 />
//               </div>
//               {/* Name Section */}
//               <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-700">
//                 {item.name}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Prewedding;
