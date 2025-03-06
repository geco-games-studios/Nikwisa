import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "@/reducers/categorySlice";
import { RootState, AppDispatch } from "@/reducers/store";
import { EventCategory } from "@/types/types";

const Categories = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const categoryStatus = useSelector(
    (state: RootState) => state.categories.status
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (categoryStatus === "loading") {
    return <div className="text-center py-6 text-gray-500">Loading...</div>;
  }

  if (categoryStatus === "failed") {
    return (
      <div className="text-center py-6 text-red-500">
        Error: Unable to load categories. Please try again later.
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No categories available at the moment.
      </div>
    );
  }

  console.log("categories", categories);
  return (
    <section className=" my-12 md:my-12">
      {/* Grid Container */}
      <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-4 mt-4 px-4 md:px-0">
        {categories.map((category: EventCategory) => (
          <Link
            href={`/${category.slug}`}
            key={category.id}
            aria-label={`View details for ${category.title}`}
            className="flex flex-col items-center text-center"
          >
            {/* Image */}
            <div
              className={`w-8 h-8 sm:w-24 sm:h-24 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:rounded-md sm:border sm:border-gray-300 hover:scale-105 transition duration-300`}
            >
              <Image
                src={category.image || "/fallback-image.png"}
                alt={category.title}
                className="object-cover"
                width={80}
                height={80}
              />
            </div>

            {/* Name */}
            <span className="mt-2 text-[8px] sm:text-[10px] lg:text-sm text-gray-700">
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
