import { fetchEventSubcategories } from "@/reducers/eventSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const EventCategoryMobile = () => {
  const dispatch: AppDispatch = useDispatch();

  // Retrieve event subcategories and status from the Redux store
  const { event_subcategories, status, error } = useSelector(
    (state: RootState) => state.eventProduct
  );

  useEffect(() => {
    // Fetch all event subcategories when the component mounts
    if (status === "idle") {
      dispatch(fetchEventSubcategories());
    }
  }, [dispatch, status]);

  console.log("event_subcategories", event_subcategories);

  // Filter subcategories containing "prevent"
  const filteredSubcategories = event_subcategories.filter((subcategory) =>
    subcategory.title.toLowerCase().includes("prevent")
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (filteredSubcategories.length === 0) {
    return <div>No subcategories found containing &quot;prevent&quot;.</div>;
  }
  return (
    <section className="md:hidden  space-y-6">
      {" "}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        event prerequisities
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {filteredSubcategories.map((subcategory) =>
          subcategory.categories?.map((category) => (
            <Link
              href={
                category.slug
                  ? `/event-planning/${category.slug
                      .toLowerCase()
                      .replace(/ /g, "-")}/`
                  : "#"
              }
              key={category.id}
              className={`flex flex-col items-center text-center ${
                !category.slug ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-disabled={!category.slug} // Optional: Accessibility
            >
              <div className="relative w-full h-32 aspect-square rounded-lg overflow-hidden shadow-md">
                {/* Background Image */}
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}

                {/* Bottom Half Shadow Overlay */}
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent">
                  {/* Text at the Very Bottom */}
                  <p className="absolute bottom-2 mb-0 inset-x-0 text-center text-[10px] text-white ">
                    {category.title}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default EventCategoryMobile;
