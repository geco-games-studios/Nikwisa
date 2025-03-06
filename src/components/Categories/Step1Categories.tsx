import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/reducers/categorySlice";
import { RootState, AppDispatch } from "@/reducers/store";
import Image from "next/image";
interface Step1CategoriesProps {
  selectedCategories: string[];
  onNext: (data: { categories: string[] }) => void;
}

const Step1Categories: React.FC<Step1CategoriesProps> = ({
  selectedCategories,
  onNext,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const categoryStatus = useSelector(
    (state: RootState) => state.categories.status
  );

  const [selected, setSelected] = useState<string[]>(selectedCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleCategory = (categoryId: string) => {
    setSelected((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  console.log("selected", selected);
  const handleNext = () => {
    if (selected.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    onNext({ categories: selected }); // Pass selected IDs
  };

  if (categoryStatus === "loading") {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (categoryStatus === "failed") {
    return (
      <div className="text-center py-6 text-red-500">
        Error: Unable to load categories.
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

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Select Categories</h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 px-4 md:px-0">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex flex-col items-center text-center cursor-pointer p-4 rounded-lg transition duration-300 border-2 ${
              selected.includes(category.id)
                ? "border-[#B8902E] bg-[#F5F5F5]" // Highlight selected category with border and background
                : "border-gray-300 bg-white"
            }`}
            onClick={() => toggleCategory(category.id)} // Use category.id
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
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="bg-[#B8902E] text-white px-4 py-2 mt-4 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Step1Categories;
