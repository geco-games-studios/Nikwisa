import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface StoreCardProps {
  id: number;
  name: string;
  image: string | null;
  rating: number;
  reviews_count: number;
  location: string;
  working_hours: string;
  event_planning_categories: string[];
  rent_hire_categories: string[];
}

const StoreCard: React.FC<StoreCardProps> = ({
  id,
  name,
  image,
  rating,
  reviews_count,
  location,
  event_planning_categories,
  rent_hire_categories,
}) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path

  // Extract the first segment of the URL (e.g., "rent-hire" or "event-planning")
  const firstSegment = pathname.split("/")[1];

  console.log("First Segment:", firstSegment);

  // Determine the correct category array dynamically
  const categories =
    firstSegment === "rent-hire"
      ? rent_hire_categories
      : event_planning_categories;

  console.log("categories", categories);
  const handleNavigation = () => {
    if (categories.length > 0) {
      router.push(`/${firstSegment}/${categories[0]}/${id}`);
    } else {
      console.warn("No categories available for navigation.");
    }
  };

  return (
    <div
      className="flex border-2 border-black rounded-lg overflow-hidden shadow-sm p-2 mt-5 cursor-pointer"
      onClick={handleNavigation} // Click anywhere on the card
    >
      <div className="w-1/3 relative">
        {image ? (
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      <div className="w-2/3 p-4 flex flex-col justify-between">
        <h2 className="md:text-lg text-sm md:mt-2 mb-1 font-semibold text-gray-800">
          {name}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">
            {rating}
          </span>
          <span className="text-gray-500 text-sm">{reviews_count} Reviews</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-1">{location}</p>

        <div className="mt-4">
          <button
            className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent div click event
              handleNavigation();
            }}
          >
            Enter Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
