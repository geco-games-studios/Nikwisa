import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import FormRow from "@/components/forms/FormRow";
import { updateStore } from "@/reducers/storeSlice";
import Image from "next/image";

interface Category {
  id: number;
  title?: string;
  slug?: string;
}

interface StoreData {
  id: number;
  name: string;
  slug: string;
  overview: string;
  location: string;
  phone_number: string;
  whats_app: string;
  working_hours: string;
  image: File | string | null;
  categories: (number | string | Category)[];
  event_planning_categories: (number | string | Category)[];
  rent_hire_categories: (number | string | Category)[];
  current_image?: string;
}

const EditStep3StoreDetails = ({
  storeData,
  onPrevious,
}: {
  storeData: StoreData;
  onPrevious: () => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState<StoreData>(storeData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof StoreData, value: string | File) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setData((prev) => ({ ...prev, image: file }));
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[+]*[0-9]{10,13}$/;

    if (!data.name?.trim()) {
      newErrors.name = "Store name is required.";
    }
    if (!data.overview?.trim()) {
      newErrors.overview = "Store overview is required.";
    }
    if (!data.location?.trim()) {
      newErrors.location = "Location is required.";
    }
    if (data.phone_number && !phoneRegex.test(data.phone_number)) {
      newErrors.phone_number = "Invalid phone number format.";
    }
    if (data.whats_app && !phoneRegex.test(data.whats_app)) {
      newErrors.whats_app = "Invalid WhatsApp number format.";
    }
    if (!data.categories?.length) {
      newErrors.categories = "At least one category is required.";
    }

    return newErrors;
  };

  const getCategoryId = (category: number | string | Category): string => {
    if (typeof category === "number") return category.toString();
    if (typeof category === "string") return category;
    if (category && typeof category === "object") {
      if ("id" in category) return category.id.toString();
    }
    return "";
  };

  const formatPayloadForBackend = (data: StoreData) => {
    const formData = new FormData();

    // Add basic text fields
    formData.append("name", data.name?.trim() || "");
    formData.append("overview", data.overview?.trim() || "");
    formData.append("location", data.location?.trim() || "");
    formData.append("phone_number", data.phone_number?.trim() || "");
    formData.append("whats_app", data.whats_app?.trim() || "");
    formData.append("working_hours", data.working_hours?.trim() || "");

    // Handle image
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    // Safely handle categories
    if (Array.isArray(data.categories)) {
      data.categories.forEach((category) => {
        const categoryId = getCategoryId(category);
        if (categoryId) {
          formData.append("categories", categoryId);
        }
      });
    }

    if (Array.isArray(data.event_planning_categories)) {
      data.event_planning_categories.forEach((category) => {
        const categoryId = getCategoryId(category);
        if (categoryId) {
          formData.append("event_planning_categories", categoryId);
        }
      });
    }

    if (Array.isArray(data.rent_hire_categories)) {
      data.rent_hire_categories.forEach((category) => {
        const categoryId = getCategoryId(category);
        if (categoryId) {
          formData.append("rent_hire_categories", categoryId);
        }
      });
    }

    console.log("Form Data (for submission):", formData);
    return formData;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = formatPayloadForBackend(data);

      // Log the FormData entries for debugging
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await dispatch(
        updateStore({
          storeId: data.id,
          storeData: formData,
        })
      );

      if ("error" in response) {
        throw new Error("Store update failed");
      }

      router.push("/dashboard/stores-lists");
    } catch (error) {
      console.error("Error updating store:", error);
      setErrors({ submit: "Failed to update store. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4">Edit Store Details</h2>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <FormRow
        type="text"
        name="name"
        value={data.name}
        handleChange={(e) => handleInputChange("name", e.target.value)}
        labelText="Store Name"
        placeholder="Enter store name"
        error={errors.name}
      />

      <FormRow
        type="textarea"
        name="overview"
        value={data.overview}
        handleChange={(e) => handleInputChange("overview", e.target.value)}
        labelText="Store Overview"
        placeholder="Enter a brief description"
        error={errors.overview}
      />

      <FormRow
        type="text"
        name="location"
        value={data.location}
        handleChange={(e) => handleInputChange("location", e.target.value)}
        labelText="Location"
        placeholder="Enter location"
        error={errors.location}
      />

      <FormRow
        type="text"
        name="phone_number"
        value={data.phone_number}
        handleChange={(e) => handleInputChange("phone_number", e.target.value)}
        labelText="Phone Number"
        placeholder="Enter phone number (e.g., +1234567890)"
        error={errors.phone_number}
      />

      <FormRow
        type="text"
        name="whats_app"
        value={data.whats_app}
        handleChange={(e) => handleInputChange("whats_app", e.target.value)}
        labelText="WhatsApp Number"
        placeholder="Enter WhatsApp number (e.g., +1234567890)"
        error={errors.whats_app}
      />

      <FormRow
        type="text"
        name="working_hours"
        value={data.working_hours}
        handleChange={(e) => handleInputChange("working_hours", e.target.value)}
        labelText="Working Hours"
        placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
      />

      <div className="mb-6">
        <label className="block text-base font-medium text-gray-700">
          Store Image
        </label>
        {data.current_image && (
          <div className="my-4">
            <Image
              src={data.current_image}
              alt="Store"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        )}
        <input
          type="file"
          id="image"
          className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={onPrevious}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
          type="button"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#B8902E] text-white px-6 py-2 rounded hover:bg-[#9a7826] transition-colors disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Updating..." : "Update Store"}
        </button>
      </div>
    </div>
  );
};

export default EditStep3StoreDetails;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import FormRow from "@/components/forms/FormRow";
// import { updateStore } from "@/reducers/storeSlice";
// import Image from "next/image";

// interface StoreData {
//   id: number;
//   name: string;
//   slug: string;
//   overview: string;
//   location: string;
//   phone_number: string;
//   whats_app: string;
//   working_hours: string;
//   image: File | string | null;
//   categories: any[]; // Making this more flexible
//   event_planning_categories: any[];
//   rent_hire_categories: any[];
//   current_image?: string;
// }

// const EditStep3StoreDetails = ({
//   storeData,
//   onPrevious,
// }: {
//   storeData: StoreData;
//   onPrevious: () => void;
// }) => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [data, setData] = useState<StoreData>(storeData);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleInputChange = (field: keyof StoreData, value: any) => {
//     setData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       const file = e.target.files[0];
//       setData((prev) => ({ ...prev, image: file }));
//     }
//   };

//   const validateFields = () => {
//     const newErrors: Record<string, string> = {};
//     const phoneRegex = /^[+]*[0-9]{10,13}$/;

//     if (!data.name?.trim()) {
//       newErrors.name = "Store name is required.";
//     }
//     if (!data.overview?.trim()) {
//       newErrors.overview = "Store overview is required.";
//     }
//     if (!data.location?.trim()) {
//       newErrors.location = "Location is required.";
//     }
//     if (data.phone_number && !phoneRegex.test(data.phone_number)) {
//       newErrors.phone_number = "Invalid phone number format.";
//     }
//     if (data.whats_app && !phoneRegex.test(data.whats_app)) {
//       newErrors.whats_app = "Invalid WhatsApp number format.";
//     }
//     if (!data.categories?.length) {
//       newErrors.categories = "At least one category is required.";
//     }

//     return newErrors;
//   };

//   // Helper function to safely get category ID
//   const getCategoryId = (category: any): string => {
//     if (typeof category === "number") return category.toString();
//     if (typeof category === "string") return category;
//     if (category && typeof category === "object") {
//       if ("id" in category) return category.id.toString();
//     }
//     return "";
//   };

//   const formatPayloadForBackend = (data: StoreData) => {
//     const formData = new FormData();

//     // Add basic text fields
//     formData.append("name", data.name?.trim() || "");
//     formData.append("overview", data.overview?.trim() || "");
//     formData.append("location", data.location?.trim() || "");
//     formData.append("phone_number", data.phone_number?.trim() || "");
//     formData.append("whats_app", data.whats_app?.trim() || "");
//     formData.append("working_hours", data.working_hours?.trim() || "");

//     // Handle image
//     if (data.image instanceof File) {
//       formData.append("image", data.image);
//     }

//     // Safely handle categories
//     if (Array.isArray(data.categories)) {
//       data.categories.forEach((category) => {
//         const categoryId = getCategoryId(category);
//         if (categoryId) {
//           formData.append("categories", categoryId);
//         }
//       });
//     }

//     if (Array.isArray(data.event_planning_categories)) {
//       data.event_planning_categories.forEach((category) => {
//         const categoryId = getCategoryId(category);
//         if (categoryId) {
//           formData.append("event_planning_categories", categoryId);
//         }
//       });
//     }

//     if (Array.isArray(data.rent_hire_categories)) {
//       data.rent_hire_categories.forEach((category) => {
//         const categoryId = getCategoryId(category);
//         if (categoryId) {
//           formData.append("rent_hire_categories", categoryId);
//         }
//       });
//     }

//     console.log("Form Data (for submission):", formData);
//     return formData;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validateFields();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const formData = formatPayloadForBackend(data);

//       // Log the FormData entries for debugging
//       for (let pair of formData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const response = await dispatch(
//         updateStore({
//           storeId: data.id,
//           storeData: formData,
//         })
//       );

//       if ("error" in response) {
//         throw new Error("Store update failed");
//       }

//       router.push("/dashboard/stores-lists");
//     } catch (error) {
//       console.error("Error updating store:", error);
//       setErrors({ submit: "Failed to update store. Please try again." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <h2 className="text-lg font-bold mb-4">Edit Store Details</h2>

//       {errors.submit && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//           {errors.submit}
//         </div>
//       )}

//       <FormRow
//         type="text"
//         name="name"
//         value={data.name}
//         handleChange={(e) => handleInputChange("name", e.target.value)}
//         labelText="Store Name"
//         placeholder="Enter store name"
//         error={errors.name}
//       />

//       <FormRow
//         type="textarea"
//         name="overview"
//         value={data.overview}
//         handleChange={(e) => handleInputChange("overview", e.target.value)}
//         labelText="Store Overview"
//         placeholder="Enter a brief description"
//         error={errors.overview}
//       />

//       <FormRow
//         type="text"
//         name="location"
//         value={data.location}
//         handleChange={(e) => handleInputChange("location", e.target.value)}
//         labelText="Location"
//         placeholder="Enter location"
//         error={errors.location}
//       />

//       <FormRow
//         type="text"
//         name="phone_number"
//         value={data.phone_number}
//         handleChange={(e) => handleInputChange("phone_number", e.target.value)}
//         labelText="Phone Number"
//         placeholder="Enter phone number (e.g., +1234567890)"
//         error={errors.phone_number}
//       />

//       <FormRow
//         type="text"
//         name="whats_app"
//         value={data.whats_app}
//         handleChange={(e) => handleInputChange("whats_app", e.target.value)}
//         labelText="WhatsApp Number"
//         placeholder="Enter WhatsApp number (e.g., +1234567890)"
//         error={errors.whats_app}
//       />

//       <FormRow
//         type="text"
//         name="working_hours"
//         value={data.working_hours}
//         handleChange={(e) => handleInputChange("working_hours", e.target.value)}
//         labelText="Working Hours"
//         placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
//       />

//       <div className="mb-6">
//         <label className="block text-base font-medium text-gray-700">
//           Store Image
//         </label>
//         {data.current_image && (
//           <div className="my-4">
//             <Image
//               src={data.current_image}
//               alt="Store"
//               width={200}
//               height={200}
//               className="rounded-lg"
//             />
//           </div>
//         )}
//         <input
//           type="file"
//           id="image"
//           className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleImageChange}
//           accept="image/*"
//         />
//       </div>

//       <div className="mt-4 flex gap-4">
//         <button
//           onClick={onPrevious}
//           className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
//           type="button"
//         >
//           Previous
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="bg-[#B8902E] text-white px-6 py-2 rounded hover:bg-[#9a7826] transition-colors disabled:opacity-50"
//           disabled={isSubmitting}
//           type="submit"
//         >
//           {isSubmitting ? "Updating..." : "Update Store"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditStep3StoreDetails;
