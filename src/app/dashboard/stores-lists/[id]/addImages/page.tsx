"use client";

import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/reducers/store";
import { uploadMultipleImages } from "@/reducers/imageSlice";
import Alert from "@/components/forms/Alert";
import Image from "next/image";

const Page = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // State for image previews
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const storeId = params.id; // Get the dynamic store ID from the route.
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for the file input

  const loading = useSelector((state: RootState) => state.images.loading);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files); // Set the FileList in state

      // Generate image previews
      const previews: string[] = [];
      Array.from(files).forEach((file, idx) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            previews[idx] = reader.result as string;
            if (previews.length === files.length) {
              // Only update the state when all previews are loaded
              setImagePreviews([...previews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setSelectedFiles(null); // Reset state if no files are selected
      setImagePreviews([]);
    }
  };

  const handleDeletePreview = (index: number) => {
    // Remove the image preview from the state
    const updatedPreviews = imagePreviews.filter((_, idx) => idx !== index);
    setImagePreviews(updatedPreviews);

    // Remove the file from the selected files list
    if (selectedFiles) {
      const updatedFiles = Array.from(selectedFiles).filter(
        (_, idx) => idx !== index
      );
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      const newFileList = dataTransfer.files; // Get the FileList from DataTransfer
      setSelectedFiles(newFileList);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setAlertMessage("Please select at least one image to upload.");
      setAlertType("error");
      return;
    }

    if (!storeId) {
      setAlertMessage("Store ID is missing.");
      setAlertType("error");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]); // Append images to the form data
    }

    try {
      await dispatch(
        uploadMultipleImages({ storeId: Number(storeId), images: formData })
      );
      setAlertMessage("Images uploaded successfully!");
      setAlertType("success");

      // Reset state after upload
      setSelectedFiles(null);
      setImagePreviews([]);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Explicitly reset file input
      }

      // Clear the alert message after 3 seconds
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    } catch {
      setAlertMessage("Failed to upload images: An unknown error occurred");
      setAlertType("error");

      // Clear the alert message after 3 seconds
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Upload Store Images</h1>

      {/* Display Alert based on success or error */}
      {alertMessage && <Alert message={alertMessage} type={alertType!} />}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-base font-medium text-gray-700"
          >
            Store Images
          </label>
          <input
            type="file"
            id="image"
            ref={fileInputRef} // Attach the ref
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            multiple
            onChange={handleFileChange}
          />

          {selectedFiles && imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <Image
                    src={preview}
                    alt={`Selected Image ${idx}`}
                    width={150} // Set appropriate width
                    height={150} // Set appropriate height
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePreview(idx)}
                    className="absolute top-2 right-2 text-red-500 bg-white p-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`py-2 px-4 rounded mt-4 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#B8902E] text-white hover:bg-[#9C7A2C]"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Images"}
        </button>
      </form>
    </div>
  );
};

export default Page;
