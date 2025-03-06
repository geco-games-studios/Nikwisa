"use client";

import { fetchEventSubcategories } from "@/reducers/eventSlice";
import { RootState, AppDispatch } from "@/reducers/store";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image"; // Import Image component from Next.js

const ForGroom = () => {
  const dispatch: AppDispatch = useDispatch();

  const { event_subcategories, status, error } = useSelector(
    (state: RootState) => state.eventProduct
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEventSubcategories());
    }
  }, [dispatch, status]);

  const filteredSubcategories = event_subcategories.filter((subcategory) =>
    subcategory.title.toLowerCase().includes("groom")
  );

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (filteredSubcategories.length === 0)
    return <div>No subcategories found containing &quot;groom&quot;.</div>;

  const groomCategories = filteredSubcategories.flatMap(
    (subcategory) => subcategory.categories || []
  );

  return (
    <div className="w-full mt-8 bg-[#EDE2D4] p-3 md:p-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Wedding Planning for Groom
          </h3>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {groomCategories.map((category) => (
            <Link
              key={category.id}
              href={
                category.slug
                  ? `/event-planning/${category.slug
                      .toLowerCase()
                      .replace(/ /g, "-")}/`
                  : "#"
              }
              className={`flex flex-col items-center text-center ${
                !category.slug ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-disabled={!category.slug}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-48 lg:h-48 bg-gray-200 rounded-full flex items-center justify-center p-4">
                {/* Use Image component here */}
                <Image
                  src={category.image}
                  alt={category.title}
                  width={100} // Specify the width of the image
                  height={100} // Specify the height of the image
                  className="w-full h-full object-contain rounded p-2"
                />
              </div>
              <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-700">
                {category.title}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ForGroom;

// "use client";

// import { fetchEventSubcategories } from "@/reducers/eventSlice";
// import { RootState, AppDispatch } from "@/reducers/store";
// import Link from "next/link";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const ForGroom = () => {
//   const dispatch: AppDispatch = useDispatch();

//   const { event_subcategories, status, error } = useSelector(
//     (state: RootState) => state.eventProduct
//   );

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchEventSubcategories());
//     }
//   }, [dispatch, status]);

//   const filteredSubcategories = event_subcategories.filter((subcategory) =>
//     subcategory.title.toLowerCase().includes("for groom")
//   );

//   if (status === "loading") return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   if (filteredSubcategories.length === 0)
//     return <div>No subcategories found containing "groom".</div>;

//   const groomCategories = filteredSubcategories.flatMap(
//     (subcategory) => subcategory.categories || []
//   );

//   return (
//     <div className="w-full mt-8 bg-[#EDE2D4] p-3 md:p-8">
//       <section>
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold text-gray-800">
//             Wedding Planning for Groom
//           </h3>
//         </div>

//         <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
//           {groomCategories.map((category) => (
//             <Link
//               key={category.id}
//               href={
//                 category.slug
//                   ? `/event-planning/${category.slug
//                       .toLowerCase()
//                       .replace(/ /g, "-")}/`
//                   : "#"
//               }
//               className={`flex flex-col items-center text-center ${
//                 !category.slug ? "cursor-not-allowed opacity-50" : ""
//               }`}
//               aria-disabled={!category.slug}
//             >
//               <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-48 bg-gray-200 rounded-full flex items-center justify-center">
//                 <img
//                   src={category.image}
//                   alt={category.title}
//                   className="w-full h-full object-cover rounded-md"
//                 />
//               </div>
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

// export default ForGroom;
