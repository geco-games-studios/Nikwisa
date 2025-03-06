"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Offering } from "@/types/types";
import { addOffering } from "@/reducers/offeringsSlice";
import { FormRow } from "@/components/FormRow";
import { AppDispatch } from "@/reducers/store";
import Image from "next/image";

const AddOfferingPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  // Ensure storeId is a string
  const storeId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [formData, setFormData] = useState<Omit<Offering, "id">>({
    name: "",
    description: "",
    price: "", // Start as an empty string
    image: null,
    phone_number: "",
    whatsapp_number: "",
    store: parseInt(storeId || "0", 10),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" ? (value === "" ? "" : parseFloat(value)) : value, // Handle empty value for price
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for submission
    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("price", formData.price.toString());
    if (formData.image) submissionData.append("image", formData.image); // Add image if provided.
    if (formData.phone_number)
      submissionData.append("phone_number", formData.phone_number);
    if (formData.whatsapp_number)
      submissionData.append("whatsapp_number", formData.whatsapp_number);
    submissionData.append("store", formData.store.toString());

    // Log the submission data for debugging
    console.log("Form data before submission:", formData);

    try {
      await dispatch(addOffering(submissionData)); // Dispatch the action with FormData.
      router.push(`/dashboard/stores-lists/${storeId}`); // Redirect to the store list page.
    } catch (error) {
      console.error("Failed to add offering", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Add Offering</h2>

        <FormRow
          type="text"
          name="name"
          value={formData.name || ""}
          handleChange={handleInputChange}
          labelText="Offering Name"
          placeholder="Enter offering name"
        />

        <FormRow
          type="textarea"
          name="description"
          value={formData.description || ""}
          handleChange={handleInputChange}
          labelText="Description"
          placeholder="Enter offering description"
        />

        <FormRow
          type="number"
          name="price"
          value={formData.price || ""} // Fallback to empty string if price is undefined
          handleChange={handleInputChange}
          labelText="Price"
          placeholder="Enter offering price"
        />

        <FormRow
          type="tel"
          name="phone_number"
          value={formData.phone_number || ""}
          handleChange={handleInputChange}
          labelText="Phone Number"
          placeholder="Enter phone number"
        />

        <FormRow
          type="tel"
          name="whatsapp_number"
          value={formData.whatsapp_number || ""}
          handleChange={handleInputChange}
          labelText="WhatsApp Number"
          placeholder="Enter WhatsApp number"
        />

        <div className="form-row">
          <label htmlFor="image" className="form-label">
            Offering Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            className="form-input"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Preview"
                width={150} // Set appropriate width
                height={150} // Set appropriate height
                className="max-w-xs rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Offering"}
        </button>
      </form>
    </div>
  );
};

export default AddOfferingPage;

// "use client";

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { Offering } from "@/types/types";
// import { addOffering } from "@/reducers/offeringsSlice";
// import { FormRow } from "@/components/FormRow";
// import { AppDispatch } from "@/reducers/store";
// import Image from "next/image";

// const AddOfferingPage = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const router = useRouter();
//   const { id: storeId } = useParams(); // Rename `id` to `storeId` for clarity.

//   const [formData, setFormData] = useState<Omit<Offering, "id">>({
//     name: "",
//     description: "",
//     price: "", // Start as an empty string
//     image: null,
//     phone_number: "",
//     whatsapp_number: "",
//     store: parseInt(storeId || "0", 10),
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]:
//         name === "price" ? (value === "" ? "" : parseFloat(value)) : value, // Handle empty value for price
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData((prevData) => ({
//         ...prevData,
//         image: file,
//       }));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     // Prepare data for submission
//     const submissionData = new FormData();
//     submissionData.append("name", formData.name);
//     submissionData.append("description", formData.description);
//     submissionData.append("price", formData.price.toString());
//     if (formData.image) submissionData.append("image", formData.image); // Add image if provided.
//     if (formData.phone_number)
//       submissionData.append("phone_number", formData.phone_number);
//     if (formData.whatsapp_number)
//       submissionData.append("whatsapp_number", formData.whatsapp_number);
//     submissionData.append("store", formData.store.toString());

//     // Log the submission data for debugging
//     console.log("Form data before submission:", formData);

//     try {
//       await dispatch(addOffering(submissionData)); // Dispatch the action with FormData.
//       router.push(`/dashboard/stores-lists/${storeId}`); // Redirect to the store list page.
//     } catch (error) {
//       console.error("Failed to add offering", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <form onSubmit={handleSubmit}>
//         <h2 className="text-lg font-bold mb-4">Add Offering</h2>

//         <FormRow
//           type="text"
//           name="name"
//           value={formData.name}
//           handleChange={handleInputChange}
//           labelText="Offering Name"
//           placeholder="Enter offering name"
//           required
//         />

//         <FormRow
//           type="textarea"
//           name="description"
//           value={formData.description}
//           handleChange={handleInputChange}
//           labelText="Description"
//           placeholder="Enter offering description"
//         />

//         <FormRow
//           type="number"
//           name="price"
//           value={formData.price || ""} // Fallback to empty string if price is undefined
//           handleChange={handleInputChange}
//           labelText="Price"
//           placeholder="Enter offering price"
//         />

//         <FormRow
//           type="tel"
//           name="phone_number"
//           value={formData.phone_number}
//           handleChange={handleInputChange}
//           labelText="Phone Number"
//           placeholder="Enter phone number"
//         />

//         <FormRow
//           type="tel"
//           name="whatsapp_number"
//           value={formData.whatsapp_number}
//           handleChange={handleInputChange}
//           labelText="WhatsApp Number"
//           placeholder="Enter WhatsApp number"
//         />

//         <div className="form-row">
//           <label htmlFor="image" className="form-label">
//             Offering Image (Optional)
//           </label>
//           <input
//             type="file"
//             id="image"
//             className="form-input"
//             onChange={handleImageChange}
//           />
//           {imagePreview && (
//             <div className="mt-2">
//               <Image
//                 src={imagePreview}
//                 alt="Preview"
//                 width={150} // Set appropriate width
//                 height={150} // Set appropriate height
//                 className="max-w-xs rounded-lg"
//               />
//             </div>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
//           disabled={loading}
//         >
//           {loading ? "Adding..." : "Add Offering"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddOfferingPage;
