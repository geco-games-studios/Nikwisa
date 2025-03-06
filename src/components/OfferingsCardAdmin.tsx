"use client";

import { deleteOffering } from "@/reducers/offeringsSlice";
import { AppDispatch } from "@/reducers/store";
import { OfferingCardProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image"; // Import Image component from Next.js

const OfferingsCardAdmin = ({ offering, storeId }: OfferingCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onEdit = (offeringId: number) => {
    router.push(
      `/dashboard/stores-lists/${storeId}/editOffering/${offeringId}`
    );
  };

  const handleDelete = async (offeringId: number) => {
    try {
      await dispatch(deleteOffering(offeringId)); // Correct ID is passed here
      toast.success("Offering deleted successfully!");
    } catch {
      toast.error("Failed to delete offering. Please try again."); // Corrected message
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-4 border border-gray-200">
      <div className="relative w-full h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {/* Replace <img> with <Image> from Next.js */}
        <Image
          src={offering.image || "/placeholder-image.jpg"} // Fallback image
          alt={offering.name}
          layout="fill" // This ensures the image covers the area, similar to the 'object-cover' style
          objectFit="cover" // This mimics the behavior of 'object-cover'
          className="absolute inset-0"
        />
      </div>

      <div className="mt-4 flex flex-col flex-grow">
        <h3 className="text-base md:text-lg font-bold text-gray-800">
          {offering.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5">{offering.description}</p>
        <p className="text-base font-bold text-gray-900 mb-1">
          K{offering.price.toFixed(2)}
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(offering.id)}
            className="flex items-center justify-center bg-yellow-500 text-white text-sm p-2 rounded hover:bg-yellow-600 transition"
            aria-label="Edit Offering"
          >
            <FaEdit className="mr-2" /> Edit
          </button>

          <button
            onClick={() => handleDelete(offering.id)}
            className="flex items-center justify-center bg-red-500 text-white text-sm p-2 rounded hover:bg-red-600 transition"
            aria-label="Delete Offering"
          >
            <FaTrashAlt className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferingsCardAdmin;
