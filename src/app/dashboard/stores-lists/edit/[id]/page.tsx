"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchStoreById } from "@/reducers/storeSlice";
import EditStep1Categories from "@/components/UpdatingStore/Step1";
import EditStep2SubCategories from "@/components/UpdatingStore/Step2";
import EditStep3StoreDetails from "@/components/UpdatingStore/Step3";

interface StoreData {
  categories: string[];
  event_planning_categories: string[];
  rent_hire_categories: string[];
  name: string;
  phone_number: string;
  whats_app: string;
  image: File | null;
  overview: string;
  location: string;
  working_hours: string;
  owner: string | null;
}

const EditStore = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const response = await dispatch(fetchStoreById(id)).unwrap();
        setStoreData({
          ...response,
          image: null, // Reset image to null for new uploads
          current_image: response.image, // Store the current image URL
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading store:", error);
        setIsLoading(false);
        // Optionally, show a user-friendly error message
      }
    };

    if (id) {
      loadStoreData();
    }
  }, [id, dispatch]);

  const handleNext = (newData: Partial<StoreData>) => {
    setStoreData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...newData,
      };
    });
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>; // Add a better loading indicator
  }

  if (!storeData) {
    return <div className="p-6">Failed to load store data.</div>; // Handle missing data
  }

  return (
    <div className="p-6">
      {step === 1 && (
        <EditStep1Categories
          selectedCategories={storeData.categories}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <EditStep2SubCategories
          selectedCategories={storeData.categories}
          selectedEventCategories={storeData.event_planning_categories}
          selectedRentHireCategories={storeData.rent_hire_categories}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
      {step === 3 && (
        <EditStep3StoreDetails
          storeData={storeData}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
};

export default EditStore;

// "use client";

// // components/EditStore/index.tsx
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { fetchStoreById } from "@/reducers/storeSlice";
// import { Category } from "@/types/types";
// import EditStep1Categories from "@/components/UpdatingStore/Step1";
// import EditStep2SubCategories from "@/components/UpdatingStore/Step2";
// import EditStep3StoreDetails from "@/components/UpdatingStore/Step3";
// // import { StoreData } from "@/types/store";

// interface StoreData {
//   id: string | number;
//   name: string;
//   overview: string;
//   location: string;
//   phone_number: string;
//   whats_app: string;
//   working_hours: string;
//   image: File | string | null;
//   current_image?: string;
//   categories: Category[];
//   event_planning_categories: Category[];
//   rent_hire_categories: Category[];
//   owner: {
//     id: number;
//     username: string;
//   } | null;
//   rating: number;
//   reviews_count: number;
//   slug: string;
// }

// const EditStore = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [step, setStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [storeData, setStoreData] = useState<StoreData | null>(null);

//   useEffect(() => {
//     const loadStoreData = async () => {
//       try {
//         const response = await dispatch(fetchStoreById(id)).unwrap();
//         setStoreData({
//           ...response,
//           image: null,
//           current_image: response.image,
//         });
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error loading store:", error);
//         setIsLoading(false);
//       }
//     };

//     if (id) {
//       loadStoreData();
//     }
//   }, [id, dispatch]);

//   const handleNext = (newData: Partial<StoreData>) => {
//     setStoreData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         ...newData,
//       };
//     });
//     setStep((prev) => prev + 1);
//   };

//   const handlePrevious = () => {
//     setStep((prev) => prev - 1);
//   };

//   if (isLoading || !storeData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-6">
//       {step === 1 && (
//         <EditStep1Categories
//           selectedCategories={storeData.categories}
//           onNext={handleNext}
//         />
//       )}
//       {step === 2 && (
//         <EditStep2SubCategories
//           selectedCategories={storeData.categories}
//           selectedEventCategories={storeData.event_planning_categories}
//           selectedRentHireCategories={storeData.rent_hire_categories}
//           onPrevious={handlePrevious}
//           onNext={handleNext}
//         />
//       )}
//       {step === 3 && (
//         <EditStep3StoreDetails
//           storeData={storeData}
//           onPrevious={handlePrevious}
//         />
//       )}
//     </div>
//   );
// };

// export default EditStore;

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { fetchStoreById } from "@/reducers/storeSlice"; // You'll need to create this
// import EditStep1Categories from "@/components/UpdatingStore/Step1";
// import EditStep2SubCategories from "@/components/UpdatingStore/Step2";
// import EditStep3StoreDetails from "@/components/UpdatingStore/Step3";

// interface StoreData {
//   id: string;
//   categories: string[];
//   event_planning_categories: string[];
//   rent_hire_categories: string[];
//   name: string;
//   phone_number: string;
//   whats_app: string;
//   image: File | null;
//   overview: string;
//   location: string;
//   working_hours: string;
//   owner: string | null;
//   current_image?: string; // To store the URL of existing image
// }

// const EditStore = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [step, setStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [storeData, setStoreData] = useState<StoreData | null>(null);

//   useEffect(() => {
//     const loadStoreData = async () => {
//       try {
//         const response = await dispatch(fetchStoreById(id)).unwrap();
//         setStoreData({
//           ...response,
//           image: null, // Initialize with null as we'll handle file upload separately
//           current_image: response.image, // Store the current image URL
//         });
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error loading store:", error);
//         setIsLoading(false);
//       }
//     };

//     if (id) {
//       loadStoreData();
//     }
//   }, [id, dispatch]);

//   const handleNext = (newData: Partial<StoreData>) => {
//     setStoreData((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         ...newData,
//         categories: newData.categories || prev.categories,
//         event_planning_categories:
//           newData.event_planning_categories || prev.event_planning_categories,
//         rent_hire_categories:
//           newData.rent_hire_categories || prev.rent_hire_categories,
//       };
//     });
//     setStep((prev) => prev + 1);
//   };

//   const handlePrevious = () => {
//     setStep((prev) => prev - 1);
//   };

//   if (isLoading || !storeData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-6">
//       {step === 1 && (
//         <EditStep1Categories
//           selectedCategories={storeData.categories}
//           onNext={(data: { categories: string[] }) =>
//             handleNext({ categories: data.categories })
//           }
//         />
//       )}
//       {step === 2 && (
//         <EditStep2SubCategories
//           selectedCategories={storeData.categories}
//           selectedEventCategories={storeData.event_planning_categories}
//           selectedRentHireCategories={storeData.rent_hire_categories}
//           onPrevious={handlePrevious}
//           onNext={(data: {
//             event_planning_categories?: string[];
//             rent_hire_categories?: string[];
//           }) =>
//             handleNext({
//               event_planning_categories: data.event_planning_categories || [],
//               rent_hire_categories: data.rent_hire_categories || [],
//             })
//           }
//         />
//       )}
//       {step === 3 && (
//         <EditStep3StoreDetails
//           storeData={storeData}
//           onPrevious={handlePrevious}
//         />
//       )}
//     </div>
//   );
// };

// export default EditStore;

// "use client";

// import Step1 from "@/components/UpdatingStore/Step1";
// import Step2 from "@/components/UpdatingStore/Step2";
// import Step3 from "@/components/UpdatingStore/Step3";
// import { AppDispatch, RootState } from "@/reducers/store";
// import { fetchStoreById } from "@/reducers/storeSlice";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const defaultStoreData = {
//   name: "",
//   categories: [],
//   event_planning_categories: [],
//   overview: "",
//   phone_number: "",
//   whats_app: "",
//   location: "",
//   image: null,
//   working_hours: null,
//   is_verified: false,
//   is_responsive: false,
// };

// const EditStore = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { id } = useParams();
//   const { store, loading } = useSelector((state: RootState) => state.stores);
//   const [step, setStep] = useState(1);
//   const [storeData, setStoreData] = useState(defaultStoreData);

//   useEffect(() => {
//     if (id) dispatch(fetchStoreById(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (store) setStoreData(store); // Prefill data if editing an existing store
//   }, [store]);

//   const handleNext = (data: Partial<typeof defaultStoreData>) => {
//     setStoreData((prev) => ({ ...prev, ...data }));
//     setStep((prev) => prev + 1);
//   };

//   const handlePrevious = () => setStep((prev) => prev - 1);

//   const handleSubmit = () => {
//     console.log("Final Data:", storeData);
//     // Handle form submission (e.g., API call)
//   };

//   return (
//     <div className="p-6">
//       {step === 1 && (
//         <Step1 selectedCategories={storeData.categories} onNext={handleNext} />
//       )}
//       {step === 2 && (
//         <Step2
//           selectedEventCategories={storeData.event_planning_categories}
//           onPrevious={handlePrevious}
//           onNext={handleNext}
//         />
//       )}
//       {step === 3 && (
//         <Step3
//           storeData={storeData}
//           storeId={id}
//           onPrevious={handlePrevious}
//           onSubmit={handleSubmit}
//         />
//       )}
//     </div>
//   );
// };

// export default EditStore;
