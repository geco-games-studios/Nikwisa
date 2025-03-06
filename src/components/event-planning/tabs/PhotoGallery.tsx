"use client";

import { fetchImagesByStoreId } from "@/reducers/imageSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image"; // Import next/image for optimized images

export default function PhotosGallery({ storeId }: { storeId: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const { images, loading, error } = useSelector(
    (state: RootState) => state.images
  );

  // Fetch images when the component mounts or storeId changes
  useEffect(() => {
    dispatch(fetchImagesByStoreId(storeId));
  }, [storeId, dispatch]);

  console.log("images", images);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Safely access the nested `images` array
  const imageUrls = images?.images || []; // Fallback to an empty array if `images` or `images.images` is undefined

  return (
    <div className="py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <Image
                src={url} // Use the URL directly
                alt={`Image ${index + 1}`}
                width={500} // Set width and height
                height={500}
                className="object-cover rounded-lg shadow-sm"
              />
            </div>
          ))
        ) : (
          <div>No images available</div>
        )}
      </div>
    </div>
  );
}
