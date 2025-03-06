"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reducers/store";
import {
  fetchReviewsByStoreId,
  deleteReview,
  partialUpdateReview,
} from "@/reducers/reviewSlice";
import { ReviewsProps } from "@/types/types";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewForm from "@/components/forms/ReviewForm";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Reviews: React.FC<ReviewsProps> = ({ storeId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { reviews, loading } = useSelector((state: RootState) => state.reviews);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      try {
        const decodedToken: { username: string } = jwtDecode(accessToken);
        setUser(decodedToken);
      } catch {
        Cookies.remove("access_token");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      dispatch(fetchReviewsByStoreId(storeId));
    }
  }, [dispatch, storeId]);

  const handleDelete = async (reviewId: string) => {
    try {
      await dispatch(deleteReview(reviewId));
      toast.success("Review deleted successfully!");
    } catch {
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const handleEdit = (reviewId: string) => {
    setEditingReviewId(reviewId);
  };

  const handleUpdate = async (data: { rating: number; comment: string }) => {
    if (!editingReviewId) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        partialUpdateReview({ reviewId: editingReviewId, partialData: data })
      );
      toast.success("Review updated successfully!");
      setEditingReviewId(null);
    } catch {
      toast.error("Failed to update review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <div>No reviews for this store yet.</div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="flex items-start gap-4 p-4 border-b border-gray-300 bg-[#D9D9D9] max-w-3xl mx-auto md:ml-0 md:mr-auto rounded-lg"
          >
            <Image
              src={review.user.profile_image || "/default-avatar.png"} // Use fallback image
              alt={review.user.username}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />

            {/* <Image
              src={review.user.profile_image}
              alt={review.user.username}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            /> */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{review.user.username}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <span className="text-green-600 font-semibold">
                  {review.rating}
                </span>
                <span className="text-green-600">★</span>
              </div>
              <p className="mt-2 text-gray-700 text-sm">{review.comment}</p>

              {editingReviewId === review.id ? (
                <ReviewForm
                  initialData={{
                    rating: review.rating,
                    comment: review.comment,
                  }}
                  onSubmit={handleUpdate}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <div className="flex gap-4">
                  {user && user.username === review.user.username ? (
                    <>
                      <button
                        onClick={() => handleEdit(review.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-blue-700 hover:shadow-lg transition-all duration-200 ease-in-out"
                      >
                        <MdEdit className="w-5 h-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(review.id.toString())}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-red-700 hover:shadow-lg transition-all duration-200 ease-in-out"
                      >
                        <MdDeleteForever className="w-5 h-5" />
                        <span>Delete</span>
                      </button>
                    </>
                  ) : !user ? (
                    <>
                      <button
                        onClick={() => router.push("/signin")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-blue-700 hover:shadow-lg transition-all duration-200 ease-in-out"
                      >
                        <span>Login</span>
                        <MdEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => router.push("/signin")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-red-700 hover:shadow-lg transition-all duration-200 ease-in-out"
                      >
                        <span>Login</span>
                        <MdDeleteForever className="w-5 h-5" />
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;

// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/reducers/store";
// import {
//   fetchReviewsByStoreId,
//   deleteReview,
//   partialUpdateReview,
// } from "@/reducers/reviewSlice";
// import { ReviewsProps } from "@/types/types";
// import { MdDeleteForever, MdEdit } from "react-icons/md";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ReviewForm from "@/components/forms/ReviewForm";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useRouter } from "next/navigation";

// const Reviews: React.FC<ReviewsProps> = ({ storeId }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { reviews, loading, error } = useSelector(
//     (state: RootState) => state.reviews
//   );

//   const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [user, setUser] = useState<{ username: string } | null>(null);

//   useEffect(() => {
//     // Fetch user from the access token
//     const accessToken = Cookies.get("access_token");
//     if (accessToken) {
//       try {
//         const decodedToken: { username: string } = jwtDecode(accessToken);
//         setUser(decodedToken); // Set user information if the token is valid
//       } catch {
//         Cookies.remove("access_token");
//         setUser(null);
//       }
//     } else {
//       setUser(null); // No token means no user
//     }
//   }, []);

//   useEffect(() => {
//     if (storeId) {
//       dispatch(fetchReviewsByStoreId(storeId));
//     }
//   }, [dispatch, storeId]);

//   const handleDelete = async (reviewId: string) => {
//     try {
//       await dispatch(deleteReview(reviewId));
//       toast.success("Review deleted successfully!");
//     } catch (error) {
//       toast.error("Failed to delete review. Please try again.");
//     }
//   };

//   const handleEdit = (reviewId: string, rating: string, comment: string) => {
//     setEditingReviewId(reviewId);
//   };

//   const handleUpdate = async (data: { rating: number; comment: string }) => {
//     if (!editingReviewId) return;

//     setIsSubmitting(true);
//     try {
//       await dispatch(
//         partialUpdateReview({
//           reviewId: editingReviewId,
//           partialData: data,
//         })
//       );
//       toast.success("Review updated successfully!");
//       setEditingReviewId(null); // Exit edit mode
//     } catch (error) {
//       toast.error("Failed to update review. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading reviews...</div>;
//   }

//   if (error) {
//     return <div>Error loading reviews: {error}</div>;
//   }
//   console.log("reviews", reviews);
//   return (
//     <div className="space-y-6">
//       {reviews.length === 0 ? (
//         <div>No reviews for this store yet.</div>
//       ) : (
//         reviews.map((review) => (
//           <div
//             key={review.id}
//             className="flex items-start gap-4 p-4 border-b border-gray-300 bg-[#D9D9D9] max-w-3xl mx-auto md:ml-0 md:mr-auto rounded-lg"
//           >
//             <img
//               src={review.user.profile_image}
//               alt={review.user.username}
//               className="w-16 h-16 rounded-full object-cover"
//             />
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold">{review.user.username}</h3>
//               <div className="flex items-center gap-1 text-gray-500 text-sm">
//                 <span className="text-green-600 font-semibold">
//                   {review.rating}
//                 </span>
//                 <span className="text-green-600">★</span>
//               </div>
//               <p className="mt-2 text-gray-700 text-sm">{review.comment}</p>
//               {editingReviewId === review.id ? (
//                 <ReviewForm
//                   initialData={{
//                     rating: review.rating,
//                     comment: review.comment,
//                   }}
//                   onSubmit={handleUpdate}
//                   isSubmitting={isSubmitting}
//                 />
//               ) : (
//                 <div className="flex gap-4">
//                   {user && user.username === review.user.username ? (
//                     <>
//                       <button
//                         onClick={() =>
//                           handleEdit(review.id, review.rating, review.comment)
//                         }
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-blue-700 hover:shadow-lg transition-all duration-200 ease-in-out"
//                       >
//                         <MdEdit className="w-5 h-5" />
//                         <span>Edit</span>
//                       </button>
//                       <button
//                         onClick={() => handleDelete(review.id.toString())}
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-red-700 hover:shadow-lg transition-all duration-200 ease-in-out"
//                       >
//                         <MdDeleteForever className="w-5 h-5" />
//                         <span>Delete</span>
//                       </button>
//                     </>
//                   ) : !user ? (
//                     <>
//                       <button
//                         onClick={() => router.push("/signin")}
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-blue-700 hover:shadow-lg transition-all duration-200 ease-in-out"
//                       >
//                         <span>Login</span>
//                         <MdEdit className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => router.push("/signin")}
//                         className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:text-red-700 hover:shadow-lg transition-all duration-200 ease-in-out"
//                       >
//                         <span>Login</span>
//                         <MdDeleteForever className="w-5 h-5" />
//                       </button>
//                     </>
//                   ) : null}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Reviews;
