"use client";

import Image from "next/image";
import React from "react";

// Data and Types
interface CategoryItem {
  name: string;
  image: string;
}

interface Category {
  title: string;
  items: CategoryItem[];
}

const miniCategories: Category[] = [
  {
    title: "Wedding Requisites",
    items: [
      { name: "Banquet Hall", image: "/assets/home/hall.png" },
      { name: "Wedding Rings", image: "/assets/home/rings.png" },
      { name: "Caterers", image: "/assets/home/cateres.png" },
    ],
  },
  {
    title: "Construction",
    items: [
      { name: "Plumber", image: "/assets/home/plumber.png" },
      { name: "Bricklayer", image: "/assets/home/bricklayer.png" },
      { name: "Electrician", image: "/assets/home/electrician.png" },
    ],
  },
  {
    title: "Rent & Hire",
    items: [
      { name: "Car Rental", image: "/assets/home/car rental.png" },
      { name: "Costume Rental", image: "/assets/home/costume hire.png" },
      { name: "Room Rental", image: "/assets/home/room hire.png" },
    ],
  },
  {
    title: "Restaurant",
    items: [
      { name: "Breakfast", image: "/assets/home/food 1.png" },
      { name: "Chinese", image: "/assets/home/food 2.png" },
      { name: "Italian", image: "/assets/home/food 3.png" },
    ],
  },
];

function MiniCategories() {
  return (
    <section className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {miniCategories.map((category, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {category.title}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {category.items.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-700 mt-2">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default MiniCategories;
