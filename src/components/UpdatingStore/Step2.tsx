import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventCategories } from "@/reducers/eventSlice";
import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";
import { RootState, AppDispatch } from "@/reducers/store";
import Image from "next/image";

interface Step2Payload {
  event_planning_categories: number[];
  rent_hire_categories: number[];
}

interface Props {
  selectedCategories: number[];
  selectedEventCategories: (string | number)[];
  selectedRentHireCategories: (string | number)[];
  onPrevious: () => void;
  onNext: (payload: Step2Payload) => void;
}

interface Category {
  id: number;
  title: string;
  slug: string;
  categories?: number[];
  image?: string;
}

const EditStep2SubCategories: React.FC<Props> = ({
  selectedCategories = [],
  selectedEventCategories = [],
  selectedRentHireCategories = [],
  onPrevious,
  onNext,
}) => {
  const dispatch: AppDispatch = useDispatch();

  // Move useSelector to the top level
  const eventCategories = useSelector(
    (state: RootState) => state.eventProduct.event_categories
  );
  const rentHireCategories = useSelector(
    (state: RootState) => state.rentHireProduct.rent_hire_categories
  );

  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [selectedRentals, setSelectedRentals] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchEventCategories());
    dispatch(fetchRentHireCategories());
  }, [dispatch]);

  // Function to extract IDs from mixed string/number array
  const extractIds = (
    categories: (string | number)[],
    categoryList: Category[]
  ): number[] => {
    return categories
      .map((cat) => {
        // If it's already a number or can be converted to a number
        if (!isNaN(Number(cat))) {
          return Number(cat);
        }
        // If it's a string (title/slug), find matching category ID
        const matchingCategory = categoryList.find(
          (listCat) =>
            listCat.title.toLowerCase() === cat.toLowerCase() ||
            listCat.slug === cat
        );
        return matchingCategory ? matchingCategory.id : null;
      })
      .filter((id): id is number => id !== null);
  };

  // Initialize selected categories from props
  useEffect(() => {
    if (Array.isArray(selectedEventCategories)) {
      const eventIds = extractIds(
        selectedEventCategories,
        eventCategories || []
      );
      setSelectedEvents(eventIds);
    }
    if (Array.isArray(selectedRentHireCategories)) {
      const rentalIds = extractIds(
        selectedRentHireCategories,
        rentHireCategories || []
      );
      setSelectedRentals(rentalIds);
    }
  }, [
    selectedEventCategories,
    selectedRentHireCategories,
    eventCategories,
    rentHireCategories,
  ]);

  // Memoize filtered event categories
  const filteredEventCategories = useMemo(() => {
    if (!Array.isArray(selectedCategories) || !Array.isArray(eventCategories))
      return [];

    return eventCategories.filter((eventCategory) =>
      eventCategory.categories?.some((categoryId: number) =>
        selectedCategories.includes(Number(categoryId))
      )
    );
  }, [eventCategories, selectedCategories]);

  // Memoize filtered rent/hire categories
  const filteredRentHireCategories = useMemo(() => {
    if (
      !Array.isArray(selectedCategories) ||
      !Array.isArray(rentHireCategories)
    )
      return [];

    return rentHireCategories.filter((rentCategory) =>
      rentCategory.categories?.some((categoryId: number) =>
        selectedCategories.includes(Number(categoryId))
      )
    );
  }, [rentHireCategories, selectedCategories]);

  const toggleEventCategory = (categoryId: number) => {
    setSelectedEvents((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleRentHireCategory = (categoryId: number) => {
    setSelectedRentals((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (selectedEvents.length === 0 && selectedRentals.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const payload: Step2Payload = {
      event_planning_categories: selectedEvents,
      rent_hire_categories: selectedRentals,
    };

    onNext(payload);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Subcategories</h2>

      {filteredEventCategories.length > 0 && (
        <div className="border border-gray-300 rounded-lg my-4 p-6 shadow-sm">
          <span className="md:text-md text-base font-normal m-4">
            Event Planning Categories
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            {filteredEventCategories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center text-center cursor-pointer p-4 rounded-lg border-2 transition duration-300 ${
                  selectedEvents.includes(category.id)
                    ? "border-[#B8902E] bg-[#F5F5F5]"
                    : "border-gray-300 bg-white"
                }`}
                onClick={() => toggleEventCategory(category.id)}
              >
                <Image
                  src={category.image || "/fallback-image.png"}
                  alt={category.title}
                  width={80}
                  height={80}
                />
                <span className="text-[8px] sm:text-[10px] lg:text-sm text-gray-700 mt-2">
                  {category.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredRentHireCategories.length > 0 && (
        <div className="border border-gray-300 rounded-lg my-4 p-6 shadow-sm">
          <span className="md:text-md text-base font-normal m-4">
            Rent & Hire Categories
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            {filteredRentHireCategories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center text-center cursor-pointer p-4 rounded-lg border-2 transition duration-300 ${
                  selectedRentals.includes(category.id)
                    ? "border-[#B8902E] bg-[#F5F5F5]"
                    : "border-gray-300 bg-white"
                }`}
                onClick={() => toggleRentHireCategory(category.id)}
              >
                <Image
                  src={category.image || "/fallback-image.png"}
                  alt={category.title}
                  width={80}
                  height={80}
                />
                <span className="text-[8px] sm:text-[10px] lg:text-sm text-gray-700 mt-2">
                  {category.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-[#B8902E] text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EditStep2SubCategories;

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchEventCategories } from "@/reducers/eventSlice";
// import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";
// import { RootState, AppDispatch } from "@/reducers/store";
// import Image from "next/image";

// interface Step2Payload {
//   event_planning_categories: number[];
//   rent_hire_categories: number[];
// }

// interface Props {
//   selectedCategories: number[];
//   selectedEventCategories: (string | number)[];
//   selectedRentHireCategories: (string | number)[];
//   onPrevious: () => void;
//   onNext: (payload: Step2Payload) => void;
// }

// const EditStep2SubCategories: React.FC<Props> = ({
//   selectedCategories = [],
//   selectedEventCategories = [],
//   selectedRentHireCategories = [],
//   onPrevious,
//   onNext,
// }) => {
//   const dispatch: AppDispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchEventCategories());
//     dispatch(fetchRentHireCategories());
//   }, [dispatch]);

//   const eventCategories =
//     useSelector((state: RootState) => state.eventProduct.event_categories) ??
//     [];

//   const rentHireCategories =
//     useSelector(
//       (state: RootState) => state.rentHireProduct.rent_hire_categories
//     ) ?? [];

//   const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
//   const [selectedRentals, setSelectedRentals] = useState<number[]>([]);

//   // Function to extract IDs from mixed string/number array
//   const extractIds = (categories: any[], categoryList: any[]): number[] => {
//     return categories
//       .map((cat) => {
//         // If it's already a number or can be converted to a number
//         if (!isNaN(Number(cat))) {
//           return Number(cat);
//         }
//         // If it's a string (title/slug), find matching category ID
//         const matchingCategory = categoryList.find(
//           (listCat) =>
//             listCat.title.toLowerCase() === cat.toLowerCase() ||
//             listCat.slug === cat
//         );
//         return matchingCategory ? matchingCategory.id : null;
//       })
//       .filter((id): id is number => id !== null);
//   };

//   // Initialize selected categories from props
//   useEffect(() => {
//     if (Array.isArray(selectedEventCategories)) {
//       const eventIds = extractIds(selectedEventCategories, eventCategories);
//       setSelectedEvents(eventIds);
//     }
//     if (Array.isArray(selectedRentHireCategories)) {
//       const rentalIds = extractIds(
//         selectedRentHireCategories,
//         rentHireCategories
//       );
//       setSelectedRentals(rentalIds);
//     }
//   }, [
//     selectedEventCategories,
//     selectedRentHireCategories,
//     eventCategories,
//     rentHireCategories,
//   ]);

//   const filteredEventCategories = useMemo(() => {
//     if (!Array.isArray(selectedCategories) || !Array.isArray(eventCategories))
//       return [];

//     return eventCategories.filter((eventCategory) =>
//       eventCategory.categories?.some((categoryId: number) =>
//         selectedCategories.includes(Number(categoryId))
//       )
//     );
//   }, [eventCategories, selectedCategories]);

//   const filteredRentHireCategories = useMemo(() => {
//     if (
//       !Array.isArray(selectedCategories) ||
//       !Array.isArray(rentHireCategories)
//     )
//       return [];

//     return rentHireCategories.filter((rentCategory) =>
//       rentCategory.categories?.some((categoryId: number) =>
//         selectedCategories.includes(Number(categoryId))
//       )
//     );
//   }, [rentHireCategories, selectedCategories]);

//   const toggleEventCategory = (categoryId: number) => {
//     setSelectedEvents((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   const toggleRentHireCategory = (categoryId: number) => {
//     setSelectedRentals((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   const handleNext = () => {
//     if (selectedEvents.length === 0 && selectedRentals.length === 0) {
//       alert("Please select at least one category.");
//       return;
//     }

//     const payload: Step2Payload = {
//       event_planning_categories: selectedEvents,
//       rent_hire_categories: selectedRentals,
//     };

//     onNext(payload);
//   };

//   return (
//     <div>
//       <h2 className="text-lg font-bold mb-4">Edit Subcategories</h2>

//       {filteredEventCategories.length > 0 && (
//         <div className="border border-gray-300 rounded-lg my-4 p-6 shadow-sm">
//           <span className="md:text-md text-base font-normal m-4">
//             Event Planning Categories
//           </span>
//           <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
//             {filteredEventCategories.map((category) => (
//               <div
//                 key={category.id}
//                 className={`flex flex-col items-center text-center cursor-pointer p-4 rounded-lg border-2 transition duration-300 ${
//                   selectedEvents.includes(category.id)
//                     ? "border-[#B8902E] bg-[#F5F5F5]"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 onClick={() => toggleEventCategory(category.id)}
//               >
//                 <Image
//                   src={category.image || "/fallback-image.png"}
//                   alt={category.title}
//                   width={80}
//                   height={80}
//                 />
//                 <span className="text-[8px] sm:text-[10px] lg:text-sm text-gray-700 mt-2">
//                   {category.title}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {filteredRentHireCategories.length > 0 && (
//         <div className="border border-gray-300 rounded-lg my-4 p-6 shadow-sm">
//           <span className="md:text-md text-base font-normal m-4">
//             Rent & Hire Categories
//           </span>
//           <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
//             {filteredRentHireCategories.map((category) => (
//               <div
//                 key={category.id}
//                 className={`flex flex-col items-center text-center cursor-pointer p-4 rounded-lg border-2 transition duration-300 ${
//                   selectedRentals.includes(category.id)
//                     ? "border-[#B8902E] bg-[#F5F5F5]"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 onClick={() => toggleRentHireCategory(category.id)}
//               >
//                 <Image
//                   src={category.image || "/fallback-image.png"}
//                   alt={category.title}
//                   width={80}
//                   height={80}
//                 />
//                 <span className="text-[8px] sm:text-[10px] lg:text-sm text-gray-700 mt-2">
//                   {category.title}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between mt-6">
//         <button
//           onClick={onPrevious}
//           className="bg-gray-500 text-white px-4 py-2 rounded"
//         >
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           className="bg-[#B8902E] text-white px-4 py-2 rounded"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditStep2SubCategories;
