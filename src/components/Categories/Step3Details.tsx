import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/reducers/store";
import FormRow from "@/components/forms/FormRow";
import { fetchEventCategories } from "@/reducers/eventSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { addStore } from "@/reducers/storeSlice";
import { Category } from "@/types/types";

// interface StoreData {
//   name: string;
//   overview: string;
//   location: string;
//   phone_number: string;
//   whats_app: string;
//   working_hours: string;
//   image: File | null; // Use File | null for consistency
//   categories: Category[];
//   event_planning_categories: Category[];
//   rent_hire_categories: Category[];
// }

interface StoreData {
  categories: string[]; // Categories are strings
  event_planning_categories: string[]; // Subcategories are strings
  rent_hire_categories: string[]; // Subcategories are strings
  name: string;
  phone_number: string;
  whats_app: string;
  image: File | null; // Changed from string to File | null
  overview: string;
  location: string;
  working_hours: string;
  owner: null | string;
}

interface Step3StoreDetailsProps {
  storeData: StoreData;
  onPrevious: () => void;
}

const Step3StoreDetails: React.FC<Step3StoreDetailsProps> = ({
  storeData,
  onPrevious,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [data, setData] = useState<StoreData>(storeData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<{ user_id: string } | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      const decodedToken: { user_id: string } = jwtDecode(accessToken);
      setUser(decodedToken);
    } catch (error) {
      console.error("Failed to decode token:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchEventCategories());
  }, [dispatch]);

  type StoreDataValue = string | File | null | Category[];

  const handleInputChange = (field: keyof StoreData, value: StoreDataValue) => {
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

    if (!data.name) {
      newErrors.name = "Store name is required.";
    }
    if (data.phone_number && !phoneRegex.test(data.phone_number)) {
      newErrors.phone_number = "Invalid phone number format.";
    }
    if (data.whats_app && !phoneRegex.test(data.whats_app)) {
      newErrors.whats_app = "Invalid WhatsApp number format.";
    }
    if (data.categories.length === 0) {
      newErrors.categories = "Category is required.";
    }

    if (
      data.event_planning_categories.length === 0 &&
      data.rent_hire_categories.length === 0
    ) {
      newErrors.subcategories =
        "Either Event Planning or Rent & Hire categories must be selected";
    }

    if (!data.image) {
      newErrors.image = "Store image is required.";
    }

    return newErrors;
  };

  const sanitizePayload = (data: StoreData) => {
    return {
      ...data,
      phone_number: data.phone_number.trim(),
      whats_app: data.whats_app.trim(),
      owner: user?.user_id,
    };
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedData = sanitizePayload(data);
      const formData = new FormData();

      formData.append("name", sanitizedData.name);
      formData.append("overview", sanitizedData.overview);
      formData.append("location", sanitizedData.location);
      formData.append("phone_number", sanitizedData.phone_number);
      formData.append("whats_app", sanitizedData.whats_app);
      formData.append("working_hours", sanitizedData.working_hours);

      if (sanitizedData.image) {
        formData.append("image", sanitizedData.image);
      }

      if (sanitizedData.owner) {
        formData.append("owner", sanitizedData.owner);
      }

      sanitizedData.categories.forEach((category) => {
        formData.append("categories", JSON.stringify(category));
      });

      sanitizedData.event_planning_categories.forEach((category) => {
        formData.append("event_planning_categories", JSON.stringify(category));
      });

      sanitizedData.rent_hire_categories.forEach((category) => {
        formData.append("rent_hire_categories", JSON.stringify(category));
      });

      const response = await dispatch(addStore(formData));

      if (response.type === "stores/addStore/fulfilled") {
        router.push("/dashboard/stores-lists");
      } else {
        console.error("Store creation failed:", response.payload);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4">Store Details</h2>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="text-red-700">
            {Object.values(errors).map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
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
        placeholder="Enter phone number"
        error={errors.phone_number}
      />

      <FormRow
        type="text"
        name="whats_app"
        value={data.whats_app}
        handleChange={(e) => handleInputChange("whats_app", e.target.value)}
        labelText="WhatsApp Number"
        placeholder="Enter WhatsApp number"
        error={errors.whats_app}
      />

      <FormRow
        type="text"
        name="working_hours"
        value={data.working_hours}
        handleChange={(e) => handleInputChange("working_hours", e.target.value)}
        labelText="Working Hours"
        placeholder="Enter Working Hours"
        error={errors.working_hours}
      />

      <div className="mb-6">
        <label
          htmlFor="image"
          className="block text-base font-medium text-gray-700"
        >
          Store Image
        </label>
        <input
          type="file"
          id="image"
          className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleImageChange}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={onPrevious}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className={`bg-[#B8902E] text-white px-4 py-2 rounded ${
            isSubmitting ? "opacity-50" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Store"}
        </button>
      </div>
    </div>
  );
};

export default Step3StoreDetails;

// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/reducers/store";
// import FormRow from "@/components/forms/FormRow";
// import { fetchEventCategories } from "@/reducers/eventSlice";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { addStore } from "@/reducers/storeSlice";
// import { Category } from "@/types/types";

// interface StoreData {
//   name: string;
//   overview: string;
//   location: string;
//   phone_number: string;
//   whats_app: string;
//   working_hours: string;
//   image: File | null;
//   categories: Category[];
//   event_planning_categories: Category[];
//   rent_hire_categories: Category[];
// }

// interface Step3StoreDetailsProps {
//   storeData: StoreData;
//   onPrevious: () => void;
// }

// const Step3StoreDetails: React.FC<Step3StoreDetailsProps> = ({
//   storeData,
//   onPrevious,
// }) => {
//   const dispatch: AppDispatch = useDispatch();
//   const router = useRouter();

//   const [data, setData] = useState<StoreData>(storeData);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [user, setUser] = useState<{ user_id: string } | null>(null);

//   useEffect(() => {
//     const accessToken = Cookies.get("access_token");
//     if (!accessToken) {
//       setUser(null);
//       return;
//     }

//     try {
//       const decodedToken: { user_id: string } = jwtDecode(accessToken);
//       setUser(decodedToken);
//     } catch (error) {
//       console.error("Failed to decode token:", error);
//       setUser(null);
//     }
//   }, []);

//   useEffect(() => {
//     dispatch(fetchEventCategories());
//   }, [dispatch]);

//   type StoreDataValue = string | File | null | Category[];

//   const handleInputChange = (field: keyof StoreData, value: StoreDataValue) => {
//     setData((prev) => ({ ...prev, [field]: value }));
//   };

//   // const handleInputChange = (field: keyof StoreData, value: any) => {
//   //   setData((prev) => ({ ...prev, [field]: value }));
//   // };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       const file = e.target.files[0];
//       setData((prev) => ({ ...prev, image: file }));
//     }
//   };
//   const validateFields = () => {
//     const newErrors: Record<string, string> = {};
//     const phoneRegex = /^[+]*[0-9]{10,13}$/;

//     if (!data.name) {
//       newErrors.name = "Store name is required.";
//     }
//     if (data.phone_number && !phoneRegex.test(data.phone_number)) {
//       newErrors.phone_number = "Invalid phone number format.";
//     }
//     if (data.whats_app && !phoneRegex.test(data.whats_app)) {
//       newErrors.whats_app = "Invalid WhatsApp number format.";
//     }
//     if (data.categories.length === 0) {
//       newErrors.categories = "Category is required.";
//     }

//     // Check if at least one of event_planning_categories or rent_hire_categories has items
//     if (
//       data.event_planning_categories.length === 0 &&
//       data.rent_hire_categories.length === 0
//     ) {
//       newErrors.subcategories =
//         "Either Event Planning or Rent & Hire categories must be selected";
//     }

//     if (!data.image) {
//       newErrors.image = "Store image is required.";
//     }

//     return newErrors;
//   };

//   const sanitizePayload = (data: StoreData) => {
//     return {
//       ...data,
//       phone_number: data.phone_number.trim(),
//       whats_app: data.whats_app.trim(),
//       owner: user?.user_id,
//     };
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validateFields();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const sanitizedData = sanitizePayload(data);
//       const formData = new FormData();

//       // Append basic fields
//       formData.append("name", sanitizedData.name);
//       formData.append("overview", sanitizedData.overview);
//       formData.append("location", sanitizedData.location);
//       formData.append("phone_number", sanitizedData.phone_number);
//       formData.append("whats_app", sanitizedData.whats_app);
//       formData.append("working_hours", sanitizedData.working_hours);

//       // Append image if exists
//       if (sanitizedData.image) {
//         formData.append("image", sanitizedData.image);
//       }

//       // Append owner
//       if (sanitizedData.owner) {
//         formData.append("owner", sanitizedData.owner);
//       }

//       // Append categories
//       sanitizedData.categories.forEach((category) => {
//         formData.append("categories", JSON.stringify(category));
//       });

//       sanitizedData.event_planning_categories.forEach((category) => {
//         formData.append("event_planning_categories", JSON.stringify(category));
//       });

//       sanitizedData.rent_hire_categories.forEach((category) => {
//         formData.append("rent_hire_categories", JSON.stringify(category));
//       });

//       const response = await dispatch(addStore(formData));

//       if (response.type === "stores/addStore/fulfilled") {
//         router.push("/dashboard/stores-lists");
//       } else {
//         console.error("Store creation failed:", response.payload);
//         setIsSubmitting(false);
//       }
//     } catch (error) {
//       console.error("Error during submission:", error);
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <h2 className="text-lg font-bold mb-4">Store Details</h2>

//       {Object.keys(errors).length > 0 && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
//           <div className="text-red-700">
//             {Object.values(errors).map((error, index) => (
//               <p key={index}>{error}</p>
//             ))}
//           </div>
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
//         placeholder="Enter phone number"
//         error={errors.phone_number}
//       />

//       <FormRow
//         type="text"
//         name="whats_app"
//         value={data.whats_app}
//         handleChange={(e) => handleInputChange("whats_app", e.target.value)}
//         labelText="WhatsApp Number"
//         placeholder="Enter WhatsApp number"
//         error={errors.whats_app}
//       />

//       <FormRow
//         type="text"
//         name="working_hours"
//         value={data.working_hours}
//         handleChange={(e) => handleInputChange("working_hours", e.target.value)}
//         labelText="Working Hours"
//         placeholder="Enter Working Hours"
//         error={errors.working_hours}
//       />

//       <div className="mb-6">
//         <label
//           htmlFor="image"
//           className="block text-base font-medium text-gray-700"
//         >
//           Store Image
//         </label>
//         <input
//           type="file"
//           id="image"
//           className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={handleImageChange}
//         />
//         {errors.image && (
//           <p className="mt-1 text-sm text-red-600">{errors.image}</p>
//         )}
//       </div>

//       <div className="mt-4">
//         <button
//           onClick={onPrevious}
//           className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
//         >
//           Previous
//         </button>
//         <button
//           onClick={handleSubmit}
//           className={`bg-[#B8902E] text-white px-4 py-2 rounded ${
//             isSubmitting ? "opacity-50" : ""
//           }`}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Creating..." : "Create Store"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Step3StoreDetails;
