"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoreCard from "@/components/StoreCard";
import { RootState, AppDispatch } from "@/reducers/store";
import { fetchStoresWithOfferings } from "@/reducers/storeSlice";
import { useParams } from "next/navigation";

const CategoryPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { stores, loading, error } = useSelector(
    (state: RootState) => state.stores
  );

  const { category } = useParams();

  console.log("Category testing:", category);
  useEffect(() => {
    dispatch(fetchStoresWithOfferings());
  }, [dispatch]);

  console.log("Stores before filtering:", stores);

  const normalizedCategory =
    typeof category === "string"
      ? category.toLowerCase().replace(/\s+/g, "-")
      : "";

  const filteredStores = stores.filter((store) => {
    const normalizedStoreCategories = store.event_planning_categories.map(
      (eventCategory: string) =>
        eventCategory.toLowerCase().replace(/\s+/g, "-")
    );

    console.log(
      "Store categories:",
      normalizedStoreCategories,
      "Checking against category:",
      normalizedCategory
    );

    return normalizedStoreCategories.includes(normalizedCategory);
  });

  console.log("Filtered stores:", filteredStores);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-0 md:p-8 space-y-6 ">
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              id={store.id}
              name={store.name}
              image={store.image}
              rating={store.rating || 0}
              reviews_count={store.reviews_count || 0}
              working_hours={store.working_hours}
              location={store.location}
              event_planning_categories={store.event_planning_categories || []}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          No stores available for the category: {category}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
