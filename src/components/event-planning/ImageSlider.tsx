import { fetchImagesByStoreId } from "@/reducers/imageSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

const ImageSlider = ({ storeId }: { storeId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    images: imageData,
    loading,
    error,
  } = useSelector((state: RootState) => state.images);
  const [currentImage, setCurrentImage] = useState(0);

  // Ensure images is an array
  const images = Array.isArray(imageData) ? imageData : imageData?.images || [];

  // Fetch images when the component mounts or storeId changes
  useEffect(() => {
    dispatch(fetchImagesByStoreId(storeId));
  }, [storeId, dispatch]);

  // Automatically change images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000); // Change interval to 10 seconds (10000 milliseconds)
    return () => clearInterval(interval); // Cleanup the interval when the component unmounts
  }, [images.length]);

  // Handle dot click to manually change the image

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-48 md:h-[320px] flex justify-center items-center">
        <span>Loading...</span> {/* Add a loading spinner if you prefer */}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full h-48 md:h-[320px] flex justify-center items-center text-red-600">
        <span>Error loading images: {error}</span>
      </div>
    );
  }

  // Limit the number of dots to 3, even if there are more images
  const numDots = 3;
  const imagesPerDot = Math.ceil(images.length / numDots);

  return (
    <section className="w-full md:w-1/2 h-48 md:h-[320px] overflow-hidden rounded-lg shadow relative">
      <div className="relative w-full h-full overflow-hidden rounded-lg shadow">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-full h-full absolute top-0 left-0 transition-opacity duration-1000 ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
            style={{
              position: currentImage === index ? "static" : "absolute",
            }}
          >
            <Image
              src={image} // Use `image` directly for image URL
              alt={`Service Photo ${index + 1}`}
              width={800} // Adjust width as needed
              height={320} // Adjust height as needed
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: numDots }).map((_, dotIndex) => {
          const start = dotIndex * imagesPerDot;
          const end = Math.min((dotIndex + 1) * imagesPerDot, images.length);

          return (
            <button
              key={dotIndex}
              onClick={() => {
                // Set current image to the first image of the selected range
                setCurrentImage(start);
              }}
              className={`h-3 w-3 rounded-full border-2 border-white ${
                currentImage >= start && currentImage < end
                  ? "bg-[#B8902E]" // Active color
                  : "bg-gray-300" // Inactive color
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ImageSlider;
