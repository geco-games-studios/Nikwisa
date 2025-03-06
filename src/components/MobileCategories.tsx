"use client";

import React from "react";
import CategoryCard from "./CategoryCard";

const miniCategories = [
  {
    title: "Wedding Requisites",
    items: [
      {
        id: 1,
        name: "Banquet Hall",
        image: "/assets/home/hall.png",
        url: "/banquet-hall",
      },
      {
        id: 2,
        name: "Wedding Rings",
        image: "/assets/home/rings.png",
        url: "/wedding-rings",
      },
      {
        id: 3,
        name: "Caterers",
        image: "/assets/home/cateres.png",
        url: "/caterers",
      },
      {
        id: 4,
        name: "Florists",
        image: "/assets/home/florist.png",
        url: "/florists",
      },
    ],
  },
  {
    title: "Construction",
    items: [
      {
        id: 5,
        name: "Plumber",
        image: "/assets/home/plumber.png",
        url: "/plumber",
      },
      {
        id: 6,
        name: "Bricklayer",
        image: "/assets/home/bricklayer.png",
        url: "/bricklayer",
      },
      {
        id: 7,
        name: "Electrician",
        image: "/assets/home/electrician.png",
        url: "/electrician",
      },
      {
        id: 8,
        name: "Painter",
        image: "/assets/home/bricklayer.png",
        url: "/painter",
      },
    ],
  },
];

function MobileCategories() {
  return (
    <section className="md:hidden  space-y-6">
      {miniCategories.map((category, index) => (
        <div key={index}>
          {/* Category Title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {category.title}
          </h2>

          {/* Grid for Cards - 4 per row */}
          <div className="grid grid-cols-4 gap-2">
            {category.items.map((item) => (
              <CategoryCard
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                url={item.url}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default MobileCategories;
