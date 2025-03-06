"use client";

import { fetchOfferingById, updateOffering } from "@/reducers/offeringsSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Handle potential array values from useParams
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const offeringIdParam = Array.isArray(params.offeringId)
    ? params.offeringId[0]
    : params.offeringId;

  // Convert the string to a number for use with the API
  const offeringId = offeringIdParam
    ? parseInt(offeringIdParam, 10)
    : undefined;

  const { offerings, loading, error } = useSelector(
    (state: RootState) => state.offerings
  );

  const [offeringData, setOfferingData] = useState({
    name: "",
    description: "",
    price: 0,
    image: null as File | null,
    phone_number: "",
    whatsapp_number: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch offering by ID on component mount
  useEffect(() => {
    if (offeringId) {
      dispatch(fetchOfferingById(offeringId));
    }
  }, [offeringId, dispatch]);

  // Update local state when offering data changes
  useEffect(() => {
    if (offerings && offerings.length > 0) {
      const currentOffering = offerings[0];
      setOfferingData({
        name: currentOffering.name || "",
        description: currentOffering.description || "",
        price:
          currentOffering.price != null ? Number(currentOffering.price) : 0,
        phone_number: currentOffering.phone_number || "",
        whatsapp_number: currentOffering.whatsapp_number || "",
        image: null, // Reset the image state
      });
      setImagePreview(
        typeof currentOffering.image === "string" ? currentOffering.image : null
      );
    }
  }, [offerings]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setOfferingData((prevState) => ({
        ...prevState,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setOfferingData((prevState) => ({
      ...prevState,
      [field]: field === "price" ? Number(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!offeringId) {
        console.error("Offering ID is missing");
        return;
      }

      // If image is null, update without image field
      const offeringPayload = offeringData.image
        ? offeringData
        : { ...offeringData, image: undefined };

      await dispatch(
        updateOffering({ offeringId, offeringData: offeringPayload })
      );

      router.push(`/dashboard/stores-lists/${id}`);
    } catch (err) {
      console.error("Failed to update offering:", err);
    }
  };

  if (loading) return <div>Loading offering...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!offerings || offerings.length === 0)
    return <div>No offering found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Offering</h2>
      <form onSubmit={handleSave}>
        {[
          {
            label: "Offering Name",
            id: "name",
            type: "text",
            value: offeringData.name,
          },
          {
            label: "Description",
            id: "description",
            type: "textarea",
            value: offeringData.description,
          },
          {
            label: "Price",
            id: "price",
            type: "number",
            value: offeringData.price,
          },
          {
            label: "Phone Number",
            id: "phone_number",
            type: "text",
            value: offeringData.phone_number,
          },
          {
            label: "WhatsApp Number",
            id: "whatsapp_number",
            type: "text",
            value: offeringData.whatsapp_number,
          },
        ].map(({ label, id, type, value }) => (
          <div className="mb-6" key={id}>
            <label
              htmlFor={id}
              className="block text-base font-medium text-gray-700"
            >
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                id={id}
                value={value as string}
                onChange={(e) => handleChange(id, e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type={type}
                id={id}
                value={value}
                onChange={(e) =>
                  handleChange(
                    id,
                    type === "number"
                      ? parseFloat(e.target.value) || 0 // Fallback to 0 if invalid
                      : e.target.value
                  )
                }
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        {/* Image Upload Field */}
        <div className="mb-6">
          <label
            htmlFor="image"
            className="block text-base font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                alt="Image Preview"
                width={500}
                height={300}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/stores-lists/${id}`)}
            className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;

// "use client";

// import { fetchOfferingById, updateOffering } from "@/reducers/offeringsSlice";
// import { AppDispatch, RootState } from "@/reducers/store";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Image from "next/image"; // Import the Image component from Next.js

// const Page = () => {
//   const params = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();

//   // Handle potential array values from useParams
//   const id = Array.isArray(params.id) ? params.id[0] : params.id;
//   const offeringIdParam = Array.isArray(params.offeringId)
//     ? params.offeringId[0]
//     : params.offeringId;

//   // Convert the string to a number for use with the API
//   const offeringId = offeringIdParam
//     ? parseInt(offeringIdParam, 10)
//     : undefined;

//   const { offerings, loading, error } = useSelector(
//     (state: RootState) => state.offerings
//   );

//   const [offeringData, setOfferingData] = useState({
//     name: "",
//     description: "",
//     price: 0,
//     image: null as File | null,
//     phone_number: "",
//     whatsapp_number: "",
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // Fetch offering by ID on component mount
//   useEffect(() => {
//     if (offeringId) {
//       dispatch(fetchOfferingById(offeringId));
//     }
//   }, [offeringId, dispatch]);

//   // Update local state when offering data changes
//   useEffect(() => {
//     if (offerings && offerings.length > 0) {
//       const currentOffering = offerings[0];
//       setOfferingData({
//         name: currentOffering.name || "",
//         description: currentOffering.description || "",
//         price:
//           currentOffering.price != null ? Number(currentOffering.price) : 0,
//         phone_number: currentOffering.phone_number || "",
//         whatsapp_number: currentOffering.whatsapp_number || "",
//         image: null, // Reset the image state
//       });
//       setImagePreview(currentOffering.image || null);
//     }
//   }, [offerings]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     if (file) {
//       setOfferingData((prevState) => ({
//         ...prevState,
//         image: file,
//       }));
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   console.log("offeringData", offeringData);
//   console.log("offeringID", offeringId);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (!offeringId) {
//         console.error("Offering ID is missing");
//         return;
//       }

//       // If image is null, update without image field
//       const offeringPayload = offeringData.image
//         ? offeringData
//         : { ...offeringData, image: undefined };

//       await dispatch(
//         updateOffering({ offeringId, offeringData: offeringPayload })
//       );

//       router.push(`/dashboard/stores-lists/${id}`);
//     } catch (err) {
//       console.error("Failed to update offering:", err);
//     }
//   };

//   const handleChange = (field: string, value: string | number) => {
//     setOfferingData((prevState) => ({
//       ...prevState,
//       [field]: field === "price" ? Number(value) : value,
//     }));
//   };

//   if (loading) return <div>Loading offering...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!offerings || offerings.length === 0)
//     return <div>No offering found.</div>;

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <h2 className="text-2xl font-bold mb-4">Edit Offering</h2>
//       <form onSubmit={handleSave}>
//         {[
//           {
//             label: "Offering Name",
//             id: "name",
//             type: "text",
//             value: offeringData.name,
//           },
//           {
//             label: "Description",
//             id: "description",
//             type: "textarea",
//             value: offeringData.description,
//           },
//           {
//             label: "Price",
//             id: "price",
//             type: "number",
//             value: offeringData.price,
//           },
//           {
//             label: "Phone Number",
//             id: "phone_number",
//             type: "text",
//             value: offeringData.phone_number,
//           },
//           {
//             label: "WhatsApp Number",
//             id: "whatsapp_number",
//             type: "text",
//             value: offeringData.whatsapp_number,
//           },
//         ].map(({ label, id, type, value }) => (
//           <div className="mb-6" key={id}>
//             <label
//               htmlFor={id}
//               className="block text-base font-medium text-gray-700"
//             >
//               {label}
//             </label>
//             {type === "textarea" ? (
//               <textarea
//                 id={id}
//                 value={value as string}
//                 onChange={(e) => handleChange(id, e.target.value)}
//                 className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             ) : (
//               <input
//                 type={type}
//                 id={id}
//                 value={value}
//                 onChange={(e) =>
//                   handleChange(
//                     id,
//                     type === "number"
//                       ? parseFloat(e.target.value)
//                       : e.target.value
//                   )
//                 }
//                 className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             )}
//           </div>
//         ))}

//         {/* Image Upload Field */}
//         <div className="mb-6">
//           <label
//             htmlFor="image"
//             className="block text-base font-medium text-gray-700"
//           >
//             Image
//           </label>
//           <input
//             type="file"
//             id="image"
//             onChange={handleImageChange}
//             className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {imagePreview && (
//             <div className="mt-4">
//               <Image
//                 src={imagePreview}
//                 alt="Image Preview"
//                 width={500}
//                 height={300}
//                 className="max-w-full h-auto rounded-lg"
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between gap-4">
//           <button
//             type="button"
//             onClick={() => router.push(`/dashboard/stores-lists/${id}`)}
//             className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Page;

// "use client";

// import { fetchOfferingById, updateOffering } from "@/reducers/offeringsSlice";
// import { AppDispatch, RootState } from "@/reducers/store";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Image from "next/image"; // Import the Image component from Next.js

// const Page = () => {
//   const { offeringId, id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();

//   const { offerings, loading, error } = useSelector(
//     (state: RootState) => state.offerings
//   );

//   const [offeringData, setOfferingData] = useState({
//     name: "",
//     description: "",
//     price: 0,
//     image: null as File | null,
//     phone_number: "",
//     whatsapp_number: "",
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // Fetch offering by ID on component mount
//   useEffect(() => {
//     if (offeringId) {
//       dispatch(fetchOfferingById(offeringId));
//     }
//   }, [offeringId, dispatch]);

//   // Update local state when offering data changes
//   useEffect(() => {
//     if (offerings && offerings.length > 0) {
//       const currentOffering = offerings[0];
//       setOfferingData({
//         name: currentOffering.name || "",
//         description: currentOffering.description || "",
//         price: currentOffering.price || 0,
//         phone_number: currentOffering.phone_number || "",
//         whatsapp_number: currentOffering.whatsapp_number || "",
//         image: null, // Reset the image state
//       });
//       setImagePreview(currentOffering.image || null);
//     }
//   }, [offerings]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     if (file) {
//       setOfferingData((prevState) => ({
//         ...prevState,
//         image: file,
//       }));
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   console.log("offeringData", offeringData);
//   console.log("offeringID", offeringId);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // If image is null, update without image field
//       const offeringPayload = offeringData.image
//         ? offeringData
//         : { ...offeringData, image: undefined };

//       await dispatch(
//         updateOffering({ offeringId, offeringData: offeringPayload })
//       );

//       router.push(`/dashboard/stores-lists/${id}`);
//     } catch (err) {
//       console.error("Failed to update offering:", err);
//     }
//   };

//   const handleChange = (field: string, value: string | number) => {
//     setOfferingData((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   if (loading) return <div>Loading offering...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!offerings || offerings.length === 0)
//     return <div>No offering found.</div>;

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <h2 className="text-2xl font-bold mb-4">Edit Offering</h2>
//       <form onSubmit={handleSave}>
//         {[
//           {
//             label: "Offering Name",
//             id: "name",
//             type: "text",
//             value: offeringData.name,
//           },
//           {
//             label: "Description",
//             id: "description",
//             type: "textarea",
//             value: offeringData.description,
//           },
//           {
//             label: "Price",
//             id: "price",
//             type: "number",
//             value: offeringData.price,
//           },
//           {
//             label: "Phone Number",
//             id: "phone_number",
//             type: "text",
//             value: offeringData.phone_number,
//           },
//           {
//             label: "WhatsApp Number",
//             id: "whatsapp_number",
//             type: "text",
//             value: offeringData.whatsapp_number,
//           },
//         ].map(({ label, id, type, value }) => (
//           <div className="mb-6" key={id}>
//             <label
//               htmlFor={id}
//               className="block text-base font-medium text-gray-700"
//             >
//               {label}
//             </label>
//             {type === "textarea" ? (
//               <textarea
//                 id={id}
//                 value={value as string}
//                 onChange={(e) => handleChange(id, e.target.value)}
//                 className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             ) : (
//               <input
//                 type={type}
//                 id={id}
//                 value={value}
//                 onChange={(e) =>
//                   handleChange(
//                     id,
//                     type === "number"
//                       ? parseFloat(e.target.value)
//                       : e.target.value
//                   )
//                 }
//                 className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             )}
//           </div>
//         ))}

//         {/* Image Upload Field */}
//         <div className="mb-6">
//           <label
//             htmlFor="image"
//             className="block text-base font-medium text-gray-700"
//           >
//             Image
//           </label>
//           <input
//             type="file"
//             id="image"
//             onChange={handleImageChange}
//             className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {imagePreview && (
//             <div className="mt-4">
//               <Image
//                 src={imagePreview}
//                 alt="Image Preview"
//                 width={500}
//                 height={300}
//                 className="max-w-full h-auto rounded-lg"
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between gap-4">
//           <button
//             type="button"
//             onClick={() => router.push(`/dashboard/stores-lists/${id}`)}
//             className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Page;
