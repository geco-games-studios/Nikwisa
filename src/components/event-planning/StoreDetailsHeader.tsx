import React from "react";
import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import ImageSlider from "./ImageSlider";
import { StoreDetailsHeaderProps } from "@/types/types";

export default function StoreDetailsHeader({ store }: StoreDetailsHeaderProps) {
  console.log("StoreDetailsHeader", store);
  return (
    <div className="flex flex-col-reverse md:flex-row md:space-x-8 mb-8 md:mt-8 ">
      {/* Left Section */}
      <div className="md:w-1/2">
        <h1 className="text-xl md:text-5xl font-bold text-gray-900 mb-2.5">
          {store.name}
        </h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-800 text-white px-1.5 py-1 rounded-md text-base md:text-lg">
            {store.rating}★
          </span>

          <span className="text-base md:text-lg text-gray-600">
            {store.reviews_count} Reviews
          </span>
        </div>
        <p className="text-gray-600 mb-0.5">{store.location}</p>
        {/* <p className="mb-0.5 text-sm">{store.overview}</p> */}
        <div className="flex flex-col md:flex-row-reverse items-center md:space-x-4">
          {/* Check Availability Button */}
          {/* <button className="w-full md:w-[33%] bg-amber-600 text-white py-2.5 rounded-md font-medium hover:bg-amber-700 transition">
            Check Availability
          </button> */}

          {/* Contact Options */}
          <div className="grid grid-cols-4 gap-2 my-6 w-full ">
            <ContactButton
              icon={FaPhone}
              label="Call"
              onClick={() =>
                store.phone_number &&
                (window.location.href = `tel:${store.phone_number}`)
              }
            />
            <ContactButton
              icon={FaWhatsapp}
              label="WhatsApp"
              onClick={() => {
                const cleanNumber = store.whats_app?.replace(/\D/g, "");
                if (cleanNumber) {
                  window.open(
                    `https://wa.me/${cleanNumber}?text=Hi,%20I'm%20interested%20in%20your%20services`,
                    "_blank"
                  );
                }
              }}
            />
            <ContactButton
              icon={FaMapMarkerAlt}
              label="Directions"
              onClick={() =>
                window.open(
                  `https://maps.google.com/?q=${encodeURIComponent(
                    store.location
                  )}`,
                  "_blank"
                )
              }
            />
            <ContactButton
              icon={FaShare}
              label="Share"
              onClick={() =>
                navigator.share?.({
                  title: store.name,
                  text: store.name,
                  url: window.location.href,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Image Section */}
      <ImageSlider storeId={store.id} />
    </div>
  );
}

function ContactButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col md:flex-row h-16 w-16  md:w-32 items-center justify-center p-4 rounded-lg bg-gray-100 sm:rounded-md sm:border sm:border-gray-300"
    >
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
        <Icon className="text-xl md:text-3xl" />
      </div>
      <span className="text-[10px] md:text-xs">{label}</span>
    </button>
  );
}
