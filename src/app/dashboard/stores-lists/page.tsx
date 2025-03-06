"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  fetchStoresWithOfferings,
  fetchStoreById,
} from "@/reducers/storeSlice";
import { AppDispatch, RootState } from "@/reducers/store";
import StoreCardAdmin from "@/components/StoreCardAdmin";

// Define the User interface for the decoded JWT token
interface User {
  id: number;
  username: string;
  email: string;
  user_id: number;
}

// Define the StorePage component
const StorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const [userId, setUserId] = useState<number | null>(null);

  // Select store-related state from Redux
  const { stores, loading, error } = useSelector(
    (state: RootState) => state.stores
  );

  // Fix the TypeScript error: assert params.id as string since route is [id]
  const id = params.id as string;

  // Extract user ID from the access token
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        router.push("/signin");
        return;
      }

      try {
        const decodedToken: User = jwtDecode(accessToken);
        setUserId(decodedToken.user_id);
      } catch (err) {
        console.error("Failed to decode token", err);
        router.push("/signin");
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch all stores with their offerings
  useEffect(() => {
    dispatch(fetchStoresWithOfferings());
  }, [dispatch]);

  // Fetch a specific store by ID with validation
  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        dispatch(fetchStoreById(parsedId));
      } else {
        console.error("ID is not a valid number");
      }
    }
  }, [dispatch, id]);

  // Filter stores to show only those owned by the logged-in user
  const userStores = stores.filter((store) => store.owner.id === userId);

  return (
    <div className="container mx-auto p-0 md:p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Stores</h1>
        {userStores.length === 0 && (
          <button
            className="bg-[#B8902E] text-white py-2 px-4 rounded"
            onClick={() => router.push("/dashboard/create-store")}
          >
            Add Store
          </button>
        )}
      </div>

      {loading && <p>Loading store...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {userStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userStores.map((store) => (
            <StoreCardAdmin
              key={store.id}
              id={store.id}
              name={store.name}
              image={store.image}
              rating={store.rating || 0}
              reviews_count={store.reviews_count || 0}
              working_hours={store.working_hours}
              location={store.location}
              event_planning_categories={store.event_planning_categories || []}
              rent_hire_categories={store.rent_hire_categories || []}
            />
          ))}
        </div>
      ) : (
        !loading && <p>No store available.</p>
      )}
    </div>
  );
};

export default StorePage;

// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { fetchStoresWithOfferings } from "@/reducers/storeSlice";
// import { AppDispatch, RootState } from "@/reducers/store";
// import StoreCardAdmin from "@/components/StoreCardAdmin"; // Ensure correct path

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   user_id: number; // Ensure this matches your decoded token structure
// }

// const StorePage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const [userId, setUserId] = useState<number | null>(null);

//   const { stores, loading, error } = useSelector(
//     (state: RootState) => state.stores
//   );

//   // Extract user ID from token
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const accessToken = Cookies.get("access_token");
//       if (!accessToken) {
//         router.push("/signin");
//         return;
//       }

//       try {
//         const decodedToken: User = jwtDecode(accessToken);
//         setUserId(decodedToken.user_id);
//       } catch (err) {
//         console.error("Failed to decode token", err);
//         router.push("/signin");
//       }
//     };

//     fetchUserData();
//   }, [router]);

//   useEffect(() => {
//     dispatch(fetchStoresWithOfferings());
//   }, [dispatch]);

//   // Filter stores owned by the logged-in user
//   const userStores = stores.filter((store) => store.owner.id === userId);

//   return (
//     <div className="container mx-auto p-0 md:p-8">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">My Stores</h1>
//         {userStores.length === 0 && (
//           <button
//             className="bg-[#B8902E] text-white py-2 px-4 rounded"
//             onClick={() => router.push("/dashboard/create-store")}
//           >
//             Add Store
//           </button>
//         )}
//       </div>

//       {loading && <p>Loading store...</p>}
//       {error && <p className="text-red-500">Error: {error}</p>}

//       {userStores.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {userStores.map((store) => (
//             <StoreCardAdmin
//               key={store.id}
//               id={store.id}
//               name={store.name}
//               image={store.image}
//               rating={store.rating || 0}
//               reviews_count={store.reviews_count || 0}
//               working_hours={store.working_hours}
//               location={store.location}
//               event_planning_categories={store.event_planning_categories || []}
//               rent_hire_categories={store.rent_hire_categories || []}
//             />
//           ))}
//         </div>
//       ) : (
//         !loading && <p>No store available.</p>
//       )}
//     </div>
//   );
// };

// export default StorePage;
