"use client";

import { fetchEventCategories } from "@/reducers/eventSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

const EventCategory = () => {
  const dispatch: AppDispatch = useDispatch();
  const { event_categories, status } = useSelector(
    (state: RootState) => state.eventProduct
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEventCategories());
    }
  }, [dispatch, status]);

  // Automatically change the displayed categories every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const totalSets = Math.ceil(event_categories.length / 3);
        return (prev + 1) % totalSets;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [event_categories.length]);

  // Handle dot click to manually change the current set of categories
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Break the categories into chunks of 3 for mobile display
  const chunks = [];
  for (let i = 0; i < event_categories.length; i += 3) {
    chunks.push(event_categories.slice(i, i + 3));
  }

  // Ensure exactly 3 dots are shown
  const totalDots = Math.max(3, chunks.length);
  const visibleDots = new Array(totalDots).fill(0);

  return (
    <section>
      {/* Desktop View - Scrollable Carousel */}
      <div className="hidden md:block mt-8 w-full border border-gray-300 rounded-lg p-6 shadow-sm relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 col-span-3">
          Event Categories
        </h2>
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div
            className="flex transition-transform duration-1000"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {chunks.map((chunk, chunkIndex) => (
              <div
                key={chunkIndex}
                className="w-full flex-shrink-0 flex justify-around items-center transition-all duration-1000"
              >
                {chunk.map((category) => (
                  <div
                    key={category.id}
                    className="w-1/3 flex items-center justify-center"
                  >
                    <Link
                      href={
                        category.slug
                          ? `/event-planning/${category.slug
                              .toLowerCase()
                              .replace(/ /g, "-")}/`
                          : "#"
                      }
                      className={`flex flex-col items-center text-center ${
                        !category.slug ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      aria-disabled={!category.slug}
                    >
                      <div className="w-48 h-48 md:w-36 md:h-36 bg-gray-200 rounded flex items-center justify-center p-4">
                        <Image
                          src={category.image}
                          alt={category.title}
                          width={100}
                          height={100}
                          className="w-full h-full object-contain rounded p-2"
                        />
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        {category.title}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {visibleDots.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => handleDotClick(dotIndex)}
              className={`h-3 w-3 rounded-full border-2 border-white ${
                currentIndex === dotIndex ? "bg-[#B8902E]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-6 mt-4 relative">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">
          Event Categories
        </h4>
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div
            className="flex transition-transform duration-1000"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {chunks.map((chunk, chunkIndex) => (
              <div
                key={chunkIndex}
                className="w-full flex-shrink-0 flex justify-around items-center"
              >
                {chunk.map((category) => (
                  <div
                    key={category.id}
                    className="w-1/3 flex items-center justify-center"
                  >
                    <Link
                      href={
                        category.slug
                          ? `/event-planning/${category.slug
                              .toLowerCase()
                              .replace(/ /g, "-")}/`
                          : "#"
                      }
                      className={`flex flex-col items-center text-center p-4 ${
                        !category.slug ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      aria-disabled={!category.slug}
                    >
                      <div className="w-26 h-26 bg-gray-200 rounded flex items-center justify-center p-4">
                        <Image
                          src={category.image}
                          alt={category.title}
                          width={60}
                          height={60}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <p className="text-xs text-gray-700 mt-2">
                        {category.title}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {visibleDots.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => handleDotClick(dotIndex)}
              className={`h-3 w-3 rounded-full border-2 border-white ${
                currentIndex === dotIndex ? "bg-[#B8902E]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategory;
