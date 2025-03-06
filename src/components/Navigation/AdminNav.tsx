"use client";

import React, { useEffect, useState } from "react";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Fixed import issue
import { logout } from "@/reducers/authSlice";
import { RootState } from "@/reducers/store";

interface AdminNavProps {
  toggleSidebar: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const [showLogout, setShowLogout] = useState(false);
  // const user = useSelector((state: any) => state.auth.user); // Access user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("user", user);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      router.push("/signin");
      return;
    }

    try {
      const decodedToken: { username: string } = jwtDecode(accessToken);
      if (!user) {
        // Optionally sync Redux user state if necessary
        console.log("Decoded token username: ", decodedToken.username);
      }
    } catch {
      router.push("/signin");
    }
  }, [router, user]);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the Redux logout action
    router.push("/signin"); // Redirect to signin page
  };

  return (
    <nav className="h-16 bg-white shadow-md flex items-center justify-between transition-all duration-300">
      <div className="w-[90%] flex justify-between items-center mx-auto">
        <button className="text-xl text-[#B8902E]" onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>
        <h3 className="hidden lg:block font-semibold text-gray-800">
          Dashboard
        </h3>
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-[#B8902E] text-white px-4 py-2 rounded-md shadow-md"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.username || "Guest"}
            <FaCaretDown />
          </button>
          {showLogout && (
            <div className="absolute left-0 top-full mt-2 w-full bg-blue-100 shadow-lg text-center rounded-md py-2">
              <button
                className="text-[#B8902E] capitalize px-4 py-2 w-full text-sm hover:bg-blue-200 rounded-md"
                onClick={handleLogout} // Use the logout handler
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;

// import React, { useEffect, useState, useRef } from "react";
// import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode"; // Fixed import issue

// interface AdminNavProps {
//   toggleSidebar: () => void;
// }

// const AdminNav: React.FC<AdminNavProps> = ({ toggleSidebar }) => {
//   const router = useRouter();
//   const [showLogout, setShowLogout] = useState(false);
//   const [user, setUser] = useState<{ username: string } | null>(null);

//   useEffect(() => {
//     const accessToken = Cookies.get("access_token");
//     if (!accessToken) {
//       router.push("/signin");
//       return;
//     }

//     try {
//       const decodedToken: { username: string } = jwtDecode(accessToken);
//       setUser(decodedToken);
//     } catch {
//       router.push("/signin");
//     }
//   }, [router]);

//   return (
//     <nav className="h-16 bg-white shadow-md flex items-center justify-between transition-all duration-300">
//       <div className="w-[90%] flex justify-between items-center mx-auto">
//         <button className="text-xl text-[#B8902E]" onClick={toggleSidebar}>
//           <FaAlignLeft />
//         </button>
//         <h3 className="hidden lg:block font-semibold text-gray-800">
//           Dashboard
//         </h3>
//         <div className="relative">
//           <button
//             className="flex items-center gap-2 bg-[#B8902E] text-white px-4 py-2 rounded-md shadow-md"
//             onClick={() => setShowLogout(!showLogout)}
//           >
//             <FaUserCircle />
//             {user?.username || "Guest"}
//             <FaCaretDown />
//           </button>
//           {showLogout && (
//             <div className="absolute left-0 top-full mt-2 w-full bg-blue-100 shadow-lg text-center rounded-md py-2">
//               <button
//                 className="text-[#B8902E] capitalize px-4 py-2 w-full text-sm hover:bg-blue-200 rounded-md"
//                 onClick={() => {
//                   Cookies.remove("access_token");
//                   Cookies.remove("refresh_token");
//                   router.push("/signin");
//                 }}
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default AdminNav;
