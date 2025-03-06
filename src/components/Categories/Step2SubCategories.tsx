import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventCategories } from "@/reducers/eventSlice";
import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";
import { RootState, AppDispatch } from "@/reducers/store";
import Image from "next/image";

// Define prop types
interface Step2SubCategoriesProps {
  selectedCategories: string[];
  selectedEventCategories: string[];
  selectedRentHireCategories: string[];
  onPrevious: () => void;
  onNext: (payload: {
    event_planning_categories: string[];
    rent_hire_categories: string[];
  }) => void;
}

const Step2SubCategories: React.FC<Step2SubCategoriesProps> = ({
  selectedCategories,
  selectedEventCategories,
  selectedRentHireCategories,
  onPrevious,
  onNext,
}) => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEventCategories());
    dispatch(fetchRentHireCategories());
  }, [dispatch]);

  const eventCategories = useSelector(
    (state: RootState) => state.eventProduct.event_categories
  );
  const rentHireCategories = useSelector(
    (state: RootState) => state.rentHireProduct.rent_hire_categories
  );

  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    selectedEventCategories
  );
  const [selectedRentals, setSelectedRentals] = useState<string[]>(
    selectedRentHireCategories
  );

  console.log("rentHireCategories:", rentHireCategories);
  console.log("eventCategories:", eventCategories);
  console.log("selectedCategories:", selectedCategories);

  const filteredEventCategories = useMemo(() => {
    return eventCategories.filter((eventCategory) =>
      eventCategory.categories.some((categoryId: number) =>
        selectedCategories.includes(categoryId)
      )
    );
  }, [eventCategories, selectedCategories]);

  const filteredRentHireCategories = useMemo(() => {
    return rentHireCategories.filter((rentCategory) =>
      rentCategory.categories?.some((categoryId: number) =>
        selectedCategories.includes(categoryId)
      )
    );
  }, [rentHireCategories, selectedCategories]);

  const toggleEventCategory = (categoryId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleRentHireCategory = (categoryId: string) => {
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

    const payload = {
      event_planning_categories: selectedEvents,
      rent_hire_categories: selectedRentals,
    };

    onNext(payload);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Select Subcategories</h2>

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

export default Step2SubCategories;

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchEventCategories } from "@/reducers/eventSlice";
// import { fetchRentHireCategories } from "@/reducers/rent&hireSlice";
// import { RootState, AppDispatch } from "@/reducers/store";
// import Image from "next/image";

// interface Step2Payload {
//   event_planning_categories?: string[];
//   rent_hire_categories?: string[];
// }

// const Step2SubCategories = ({
//   selectedCategories,
//   selectedEventCategories,
//   selectedRentHireCategories,
//   onPrevious,
//   onNext,
// }: any) => {
//   const dispatch: AppDispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchEventCategories());
//     dispatch(fetchRentHireCategories());
//   }, [dispatch]);

//   const eventCategories = useSelector(
//     (state: RootState) => state.eventProduct.event_categories
//   );
//   const rentHireCategories = useSelector(
//     (state: RootState) => state.rentHireProduct.rent_hire_categories
//   );

//   const [selectedEvents, setSelectedEvents] = useState<string[]>(
//     selectedEventCategories
//   );
//   const [selectedRentals, setSelectedRentals] = useState<string[]>(
//     selectedRentHireCategories
//   );

//   console.log("rentHireCategories:", rentHireCategories);
//   console.log("eventCategories:", eventCategories);
//   console.log("selectedCategories:", selectedCategories);

//   const filteredEventCategories = useMemo(() => {
//     return eventCategories.filter((eventCategory) =>
//       eventCategory.categories.some((categoryId: number) =>
//         selectedCategories.includes(categoryId)
//       )
//     );
//   }, [eventCategories, selectedCategories]);

//   const filteredRentHireCategories = useMemo(() => {
//     return rentHireCategories.filter((rentCategory) =>
//       rentCategory.categories?.some((categoryId: number) =>
//         selectedCategories.includes(categoryId)
//       )
//     );
//   }, [rentHireCategories, selectedCategories]);

//   const toggleEventCategory = (categoryId: string) => {
//     setSelectedEvents((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   const toggleRentHireCategory = (categoryId: string) => {
//     setSelectedRentals((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   // In Step2SubCategories
//   const handleNext = () => {
//     if (selectedEvents.length === 0 && selectedRentals.length === 0) {
//       alert("Please select at least one category.");
//       return;
//     }

//     const payload = {
//       event_planning_categories: selectedEvents,
//       rent_hire_categories: selectedRentals,
//     };

//     onNext(payload);
//   };
//   return (
//     <div>
//       <h2 className="text-lg font-bold mb-4">Select Subcategories</h2>

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

// export default Step2SubCategories;
