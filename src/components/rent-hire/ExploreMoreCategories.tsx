"use client";

import { AppDispatch, RootState } from "@/reducers/store";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";

const ExploreMoreCategories = () => {
  const dispatch: AppDispatch = useDispatch();
  const rent_hire_categories = useSelector(
    (state: RootState) => state.rentHireProduct.rent_hire_categories
  );
  const status = useSelector(
    (state: RootState) => state.rentHireProduct.status
  );
  const error = useSelector((state: RootState) => state.rentHireProduct.error);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchRentHireCategories());
  }, [dispatch]);

  if (!isClient) return null;
  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (rent_hire_categories.length === 0)
    return <div>No additional categories available.</div>;

  return (
    <div className="mt-6">
      {/* MOBILE VIEW (List with underline) */}
      <div className="block md:hidden max-w-md mx-auto bg-white rounded-lg shadow-sm">
        <div className="text-center bg-gray-100 text-gray-700 font-medium py-3">
          Explore more A to Z
        </div>
        {rent_hire_categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/rent-hire/${category.slug
              .toLowerCase()
              .replace(/ /g, "-")}/`}
            className={`flex items-center px-4 py-3 hover:bg-gray-100 transition ${
              index !== rent_hire_categories.length - 1
                ? "border-b border-gray-200"
                : ""
            }`}
          >
            <span className="text-gray-800 text-sm font-medium">
              {category.title}
            </span>
          </Link>
        ))}
      </div>

      {/* DESKTOP VIEW (Grid with bordered buttons) */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Explore more A to Z</h2>
        <div className="grid grid-cols-3 gap-4">
          {rent_hire_categories.map((category) => (
            <Link
              key={category.id}
              href={`/rent-hire/${category.slug
                .toLowerCase()
                .replace(/ /g, "-")}/`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-200 transition"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreCategories;

// "use client";

// import { AppDispatch, RootState } from "@/reducers/store";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";

// const ExploreMoreCategories = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const rent_hire_categories = useSelector(
//     (state: RootState) => state.rentHireProduct.rent_hire_categories
//   );
//   const status = useSelector(
//     (state: RootState) => state.rentHireProduct.status
//   );
//   const error = useSelector((state: RootState) => state.rentHireProduct.error);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//     dispatch(fetchRentHireCategories());
//   }, [dispatch]);

//   if (!isClient) return null;
//   if (status === "loading") return <div>Loading...</div>;
//   if (status === "failed") return <div>Error: {error}</div>;
//   if (rent_hire_categories.length === 0)
//     return <div>No additional categories available.</div>;

//   return (
//     <div className="mt-6">
//       {/* MOBILE VIEW (List Style) */}
//       <div className="block md:hidden max-w-md mx-auto bg-white rounded-lg shadow-sm">
//         <div className="text-center bg-gray-100 text-gray-700 font-medium py-3">
//           Explore more A to Z
//         </div>
//         {rent_hire_categories.map((category, index) => (
//           <Link
//             key={category.id}
//             href={`/rent-hire/${category.slug
//               .toLowerCase()
//               .replace(/ /g, "-")}/`}
//             className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
//           >
//             <span className="text-gray-800 text-sm font-medium">
//               {category.title}
//             </span>
//           </Link>
//         ))}
//       </div>

//       {/* DESKTOP VIEW (Grid Style) */}
//       <div className="hidden md:block">
//         <h2 className="text-lg font-semibold mb-4">Explore more A to Z</h2>
//         <div className="grid grid-cols-3 gap-4">
//           {rent_hire_categories.map((category) => (
//             <Link
//               key={category.id}
//               href={`/rent-hire/${category.slug
//                 .toLowerCase()
//                 .replace(/ /g, "-")}/`}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
//             >
//               {category.title}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExploreMoreCategories;

// "use client";

// import { AppDispatch, RootState } from "@/reducers/store";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";

// const ExploreMoreCategories = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const rent_hire_categories = useSelector(
//     (state: RootState) => state.rentHireProduct.rent_hire_categories
//   );
//   const status = useSelector(
//     (state: RootState) => state.rentHireProduct.status
//   );
//   const error = useSelector((state: RootState) => state.rentHireProduct.error);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//     dispatch(fetchRentHireCategories());
//   }, [dispatch]);

//   if (!isClient) return null;
//   if (status === "loading") return <div>Loading...</div>;
//   if (status === "failed") return <div>Error: {error}</div>;
//   if (rent_hire_categories.length === 0)
//     return <div>No additional categories available.</div>;

//   return (
//     <div className="hidden md:block mt-6">
//       <h2 className="text-lg font-semibold mb-4">Explore more A to Z</h2>
//       <div className="flex flex-wrap gap-3">
//         {rent_hire_categories.map((category) => (
//           <Link
//             key={category.id}
//             href={`/rent-hire/${category.slug
//               .toLowerCase()
//               .replace(/ /g, "-")}/`}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
//           >
//             {category.title}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ExploreMoreCategories;
