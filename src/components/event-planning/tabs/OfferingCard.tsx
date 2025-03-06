import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Image from "next/image"; // Importing the Image component

interface OfferingCardProps {
  offering: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    phone_number?: number; // Optional property
    whatsapp_number?: number; // Optional property
  };
}

const OfferingCard = ({ offering }: OfferingCardProps) => {
  return (
    <div className="flex items-center bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-lg">
      {/* Image Section */}
      <div className="relative w-2/5 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={offering.image} // Ensure image path is valid (absolute or public path)
          alt={offering.name}
          layout="fill" // This makes the image cover the container dimensions
          objectFit="cover" // This ensures the image covers the container while maintaining aspect ratio
          className="absolute inset-0 w-full h-full"
        />
        {/* Heart Icon */}
        <div className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="red"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.645 3.41a6.354 6.354 0 00-9 9L12 21.945l9.355-9.535a6.354 6.354 0 00-9-9.001z"
            />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <div className="ml-4 flex flex-col flex-grow w-3/5 ">
        {/* Title */}
        <h3 className="text-base md:text-lg font-bold text-gray-800">
          {offering.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5">{offering.description}</p>

        {/* Price */}
        <p className="text-base font-bold text-gray-900 mb-1">
          K{offering.price.toFixed(2)}
        </p>

        {/* Buttons Section */}
        <div className="flex gap-2">
          {offering.phone_number && (
            <a
              href={`tel:${offering.phone_number}`}
              className="flex items-center justify-center bg-blue-500 text-white text-sm p-2 py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              <FaPhoneAlt className="w-5 h-5" />
            </a>
          )}

          {offering.whatsapp_number && (
            <a
              href={`https://wa.me/${offering.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 text-white text-sm p-2 px-4 py-2 rounded hover:bg-green-600 transition"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferingCard;
