"use client";

import { fetchUserById } from "@/reducers/authSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Image from "next/image";
import { DecodedToken } from "@/types/types";

// Define a type for the decoded JWT token

const ProfilePage = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Function to fetch user data
  const fetchUserData = useCallback(
    (token: string) => {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        if (decoded?.user_id) {
          dispatch(fetchUserById(decoded.user_id));
        }
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      fetchUserData(token);
    }
  }, [fetchUserData]);

  const handleEditProfileClick = () => {
    router.push(`/dashboard/profile/${user?.id}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 ">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Profile Card */}
        <div className="w-full md:w-1/3 min-h-full">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center">
              <Image
                src={user?.profile_image || "/default-avatar.jpg"}
                alt={user?.username || "User Profile"}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                {user?.first_name || "N/A"} {user?.last_name || "N/A"}
              </h3>
              <p className="text-gray-600 mb-2">{user?.email || "N/A"}</p>
              <p className="text-gray-600 mb-4">
                {user?.phone_number || "N/A"}
              </p>
              <button
                onClick={handleEditProfileClick}
                className="bg-[#B8902E] text-white py-2 px-6 rounded-full w-full max-w-xs"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Stacked Cards */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 min-h-full">
          {/* Top Card - Account Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-2">
                  <strong>Username:</strong> {user?.username || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Address:</strong> {user?.address_line || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>City:</strong> {user?.city || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>State:</strong> {user?.state || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  <strong>Country:</strong> {user?.country || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Date of Birth:</strong> {user?.date_of_birth || "N/A"}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Gender:</strong> {user?.gender || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// "use client";

// import { fetchUserById } from "@/reducers/authSlice";
// import { AppDispatch, RootState } from "@/reducers/store";
// import { useRouter } from "next/navigation";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";

// const ProfilePage = () => {
//   const router = useRouter();
//   const dispatch: AppDispatch = useDispatch();
//   const { user, loading: userLoading } = useSelector(
//     (state: RootState) => state.auth
//   );

//   useEffect(() => {
//     const token = Cookies.get("access_token");
//     if (token) {
//       fetchUserData(token);
//     }
//   }, []);

//   const fetchUserData = (token: string) => {
//     try {
//       const decoded: any = jwtDecode(token);
//       if (decoded?.user_id) {
//         dispatch(fetchUserById(decoded.user_id));
//       }
//     } catch (err) {
//       console.error("Failed to decode token", err);
//     }
//   };

//   const handleEditProfileClick = () => {
//     router.push(`/dashboard/profile/${user?.id}`);
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 ">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Left Profile Card */}
//         <div className="w-full md:w-1/3 min-h-full">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex flex-col items-center">
//               <img
//                 src={user?.profile_image || "/default-avatar.jpg"}
//                 alt={user?.username || "User Profile"}
//                 className="w-32 h-32 object-cover rounded-full mb-4"
//               />
//               <h3 className="text-xl font-semibold mb-2">
//                 {user?.first_name || "N/A"} {user?.last_name || "N/A"}
//               </h3>
//               <p className="text-gray-600 mb-2">{user?.email || "N/A"}</p>
//               <p className="text-gray-600 mb-4">
//                 {user?.phone_number || "N/A"}
//               </p>
//               <button
//                 onClick={handleEditProfileClick}
//                 className="bg-[#B8902E] text-white py-2 px-6 rounded-full w-full max-w-xs"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Stacked Cards */}
//         <div className="w-full md:w-2/3 flex flex-col gap-6 min-h-full">
//           {/* Top Card - Account Information */}
//           <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
//             <h2 className="text-xl font-semibold mb-4">Account Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Username:</strong> {user?.username || "N/A"}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Address:</strong> {user?.address_line || "N/A"}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <strong>City:</strong> {user?.city || "N/A"}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <strong>State:</strong> {user?.state || "N/A"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Country:</strong> {user?.country || "N/A"}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Date of Birth:</strong> {user?.date_of_birth || "N/A"}
//                 </p>
//                 <p className="text-gray-600 mb-2">
//                   <strong>Gender:</strong> {user?.gender || "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
