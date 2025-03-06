"use client";

import StoreDetailsHeader from "@/components/event-planning/StoreDetailsHeader";
import AddReview from "@/components/event-planning/tabs/AddReview";
import Overview from "@/components/event-planning/tabs/Overview";
import Reviews from "@/components/event-planning/tabs/Reviews";
import { AppDispatch, RootState } from "@/reducers/store";
import { fetchStoreById } from "@/reducers/storeSlice";
import { fetchReviewsByStoreId } from "@/reducers/reviewSlice";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import OfferingsAdmin from "@/components/event-planning/tabs/OfferingsAdmin";
import PhotosGalleryAdmin from "@/components/event-planning/tabs/PhotoGalleryAdmin";

interface User {
  id: number;
  username: string;
  email: string;
  user_id: number;
  store_id: number;
}

const StoreDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams(); // Get store ID from URL params

  const { store, loading, error } = useSelector(
    (state: RootState) => state.stores
  ); // Single store from state
  const { reviews } = useSelector((state: RootState) => state.reviews);

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Get user details from decoded token
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      try {
        const decodedToken: User = jwtDecode(accessToken); // Decode token to get user info
        setUser(decodedToken); // Set user info
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    } else {
      router.push("/signin"); // Redirect to sign-in if no token is found
    }
  }, [router]);

  // Fetch store by storeId from the URL params
  useEffect(() => {
    if (id) {
      dispatch(fetchStoreById(parseInt(id, 10))); // Fetch store based on the store ID in the URL
    }
  }, [dispatch, id]);

  // Fetch reviews based on the store ID
  useEffect(() => {
    if (id) {
      dispatch(fetchReviewsByStoreId(parseInt(id, 10))); // Fetch reviews for the selected store
    }
  }, [dispatch, id]);

  // Handle loading and error states
  if (loading) {
    return <div>Loading store details and reviews...</div>;
  }

  if (error) {
    return <div>Something went wrong: {error}. Please try again later.</div>;
  }

  if (!store) {
    return <div>No store found for the given ID.</div>;
  }

  // Render tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview overview={store.overview} />;
      case "reviews":
        return (
          <div>
            <Reviews reviews={reviews} storeId={store.id} />
            {/* Add Review Section */}
            {!showAddReviewForm ? (
              <button
                onClick={() => setShowAddReviewForm(true)}
                className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
              >
                Add a Review
              </button>
            ) : (
              // Pass user data to AddReview component
              <AddReview
                storeId={store.id} // Pass storeId to AddReview
                user={user} // Pass decoded user details
                onSubmit={() => {
                  dispatch(fetchReviewsByStoreId(store.id)); // Refresh reviews after adding
                  setShowAddReviewForm(false); // Hide form after submission
                }}
              />
            )}
          </div>
        );
      case "offerings":
        return <OfferingsAdmin storeId={store.id} />;
      case "photos":
        return <PhotosGalleryAdmin storeId={store.id} />;
      default:
        return <Overview overview={store.overview} />;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 my-8">
      <StoreDetailsHeader store={store} />

      {/* Tab Navigation */}
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
                  ? "border-[#b8902e] text-[#B8902E]"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default StoreDetailPage;
