"use client";

import StoreDetailsHeader from "@/components/event-planning/StoreDetailsHeader";
import AddReview from "@/components/event-planning/tabs/AddReview";
import Offerings from "@/components/event-planning/tabs/Offerings";
import Overview from "@/components/event-planning/tabs/Overview";
import PhotosGallery from "@/components/event-planning/tabs/PhotoGallery";
import Reviews from "@/components/event-planning/tabs/Reviews";
import { AppDispatch, RootState } from "@/reducers/store";
import { fetchStoresWithOfferings } from "@/reducers/storeSlice";
import { fetchReviewsByStoreId } from "@/reducers/reviewSlice";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const StoreDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { category, id } = useParams(); // Get category and id from the URL params
  const router = useRouter();

  const { stores, loading, error } = useSelector(
    (state: RootState) => state.stores
  );

  const { reviews, loadingReviews, errorReviews } = useSelector(
    (state: RootState) => state.reviews
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const tabContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
      try {
        const decodedToken: { username: string } = jwtDecode(accessToken);
        setUser(decodedToken); // Set user information if the token is valid
      } catch {
        Cookies.remove("access_token"); // Remove invalid token
        setUser(null);
      }
    } else {
      setUser(null); // No token means no user
    }
  }, []);

  useEffect(() => {
    dispatch(fetchStoresWithOfferings());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchReviewsByStoreId(parseInt(id, 10)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (tabContentRef.current) {
      tabContentRef.current.style.maxHeight = `${window.innerHeight - 200}px`;
    }
  }, [activeTab]);

  if (!category || !id) {
    return <div>Loading store details...</div>;
  }

  const storeId = parseInt(id as string, 10);
  const decodedCategory = decodeURIComponent(category).trim();

  const filteredStore = stores.find(
    (store) =>
      store.id === storeId &&
      store.event_planning_categories.some(
        (eventCategory: string) =>
          eventCategory.toLowerCase().replace(/\s+/g, "-") ===
          decodedCategory.toLowerCase().replace(/\s+/g, "-")
      )
  );

  if (loading || loadingReviews) {
    return <div>Loading...</div>;
  }

  if (error || errorReviews) {
    return <div>{`Error: ${error || errorReviews}`}</div>;
  }

  if (!filteredStore) {
    return <div>No store found for the given category and ID.</div>;
  }

  const handleAddReviewClick = () => {
    if (user) {
      setShowAddReviewForm((prev) => !prev);
    } else {
      router.push("/signin");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview overview={filteredStore.overview} />;
      case "reviews":
        return (
          <div>
            <Reviews reviews={reviews} storeId={filteredStore.id} />
            {/* Conditional Button Rendering */}
            {user ? (
              <button
                onClick={handleAddReviewClick}
                className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
              >
                {showAddReviewForm ? "Cancel" : "Add  Review"}
              </button>
            ) : (
              <button
                onClick={() => router.push("/signin")}
                className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
              >
                Login to Add a Review
              </button>
            )}
            {showAddReviewForm && <AddReview storeId={filteredStore.id} />}
          </div>
        );
      case "offerings":
        return <Offerings storeId={filteredStore.id} />;
      case "photos":
        return <PhotosGallery storeId={filteredStore.id} />;
      default:
        return <Overview overview={filteredStore.overview} />;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 my-8 mt-10">
      <StoreDetailsHeader store={filteredStore} />

      <div className="mt-6 border-b">
        <nav className="flex space-x-6">
          {[
            { label: "Overview", value: "overview" },
            { label: "Reviews", value: "reviews" },
            { label: "Offerings", value: "offerings" },
            { label: "Photos", value: "photos" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`pb-2 text-sm md:text-lg font-medium border-b-2 transition-colors duration-300 ${
                activeTab === tab.value
                  ? "border-[#B8902E] text-[#B8902E]"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div
        className="tab-content-container mt-6 overflow-y-auto transition-all duration-500 ease-in-out"
        ref={tabContentRef}
      >
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StoreDetailPage;
