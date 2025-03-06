"use client";

import { AppDispatch } from "@/reducers/store";
import { deleteStore } from "@/reducers/storeSlice";
import { StoreCardProps } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const StoreCardAdmin: React.FC<StoreCardProps> = ({
  id,
  name,
  image,
  rating,
  reviews_count,
  location,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleViewNavigation = () => {
    router.push(`/dashboard/stores-lists/${id}`);
  };

  const handleEditNavigation = () => {
    router.push(`/dashboard/stores-lists/edit/${id}`);
  };

  const handleDeleteStore = async () => {
    try {
      await dispatch(deleteStore(id)).unwrap();
      toast.success("Store deleted successfully!");
      window.location.reload();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Failed to delete store.";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      key={id}
      className="flex border-2 border-black rounded-lg overflow-hidden shadow-sm p-2 mt-5"
    >
      <div className="w-1/3 relative">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover rounded" />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded">
            <span>No image available</span>
          </div>
        )}
      </div>

      <div className="w-2/3 p-4 flex flex-col justify-between">
        <h2 className="md:text-lg text-base md:mt-2 mb-1 font-semibold text-gray-800">
          {name}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">
            {rating}
          </span>
          <span className="text-gray-500 text-sm">{reviews_count} Reviews</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-1">{location}</p>
        <div className="mt-4 flex gap-2">
          <button
            className="w-32 bg-[#B8902E] hover:bg-yellow-600 text-white py-2 px-4 rounded text-[9px] md:text-sm font-medium transition"
            onClick={handleViewNavigation}
          >
            View
          </button>
          <button
            className="w-32 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-[9px] md:text-sm font-medium transition"
            onClick={handleEditNavigation}
          >
            Edit
          </button>
          <button
            className="w-32 hover:bg-[#f8d7da] bg-[#842029] text-white py-2 rounded text-[9px] md:text-sm font-medium transition"
            onClick={handleDeleteStore}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCardAdmin;

// "use client";

// import { AppDispatch } from "@/reducers/store";
// import { deleteStore } from "@/reducers/storeSlice";
// import { StoreCardProps } from "@/types/types";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify"; // Optional: for notifications

// const StoreCardAdmin: React.FC<StoreCardProps> = ({
//   id,
//   name,
//   image,
//   rating,
//   reviews_count,
//   location,
// }) => {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>(); // Use the correct dispatch type for TypeScript

//   // Handle navigation to the view store page
//   const handleViewNavigation = () => {
//     router.push(`/dashboard/stores-lists/${id}`);
//   };

//   // Handle navigation to the edit store page
//   const handleEditNavigation = () => {
//     router.push(`/dashboard/stores-lists/edit/${id}`);
//   };

//   // Handle store deletion
//   const handleDeleteStore = async () => {
//     try {
//       await dispatch(deleteStore(id.toString())).unwrap(); // Dispatch and unwrap the promise
//       toast.success("Store deleted successfully!"); // Optional: Show success notification
//       window.location.reload(); // Reload the page after deletion
//     } catch (error: any) {
//       toast.error(error || "Failed to delete store."); // Optional: Show error notification
//     }
//   };

//   return (
//     <div
//       key={id}
//       className="flex border-2 border-black rounded-lg overflow-hidden shadow-sm p-2 mt-5 "
//     >
//       <div className="w-1/3 relative">
//         {image ? (
//           <Image
//             src={image}
//             alt={name}
//             layout="fill" // Ensures the image covers the container
//             objectFit="cover" // Ensures proper scaling
//             className="rounded"
//           />
//         ) : (
//           <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded">
//             <span>No image available</span>
//           </div>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="w-2/3 p-4 flex flex-col justify-between">
//         <h2 className="md:text-lg text-base md:mt-2 mb-1 font-semibold text-gray-800">
//           {name}
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//           <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">
//             {rating}
//           </span>
//           <span className="text-gray-500 text-sm">{reviews_count} Reviews</span>
//         </div>
//         <p className="text-sm text-gray-500 mt-1 mb-1">{location}</p>
//         <div className="mt-4 flex gap-2">
//           {/* Button to view the store */}
//           <button
//             className="w-32 bg-[#B8902E] hover:bg-yellow-600 text-white py-2 px-4 rounded text-[9px] md:text-sm font-medium transition"
//             onClick={handleViewNavigation}
//           >
//             View
//           </button>
//           {/* Button to edit the store */}
//           <button
//             className="w-32 bg-blue-600  hover:bg-blue-700 text-white py-2 rounded text-[9px] md:text-sm font-medium transition"
//             onClick={handleEditNavigation}
//           >
//             Edit
//           </button>
//           {/* Button to delete the store */}
//           <button
//             className="w-32 hover:bg-[#f8d7da] bg-[#842029] text-white py-2 rounded text-[9px] md:text-sm font-medium transition"
//             onClick={handleDeleteStore}
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StoreCardAdmin;
