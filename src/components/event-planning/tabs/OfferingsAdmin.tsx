"use client";
import OfferingsCardAdmin from "@/components/OfferingsCardAdmin";
import { fetchOfferingsByStoreId } from "@/reducers/offeringsSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const OfferingsAdmin = ({ storeId }: { storeId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { offerings, loading, error } = useSelector(
    (state: RootState) => state.offerings
  );

  const router = useRouter();

  // Fetch offerings when component mounts or storeId changes
  useEffect(() => {
    dispatch(fetchOfferingsByStoreId(storeId));
  }, [storeId, dispatch]);

  console.log("offerings", offerings);
  console.log("id", storeId);

  if (loading) {
    return <div>Loading offerings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Offerings</h2>

        <button
          onClick={() => router.push(`${storeId}/addOffering/`)}
          className="w-32 bg-[#B8902E] hover:bg-yellow-600 text-white py-2 px-4 rounded text-sm font-medium transition"
        >
          Add Offering
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
        {offerings.length === 0 ? (
          <div className="text-center text-lg">No products available</div>
        ) : (
          offerings.map((offering) => (
            <OfferingsCardAdmin
              key={offering.id}
              offering={offering}
              storeId={storeId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OfferingsAdmin;
