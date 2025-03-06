"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/reducers/store";
import { setAuth, logout } from "@/reducers/authSlice";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import AdminNav from "@/components/Navigation/AdminNav";
import BigSidebar from "@/components/Navigation/BigSidebar";
import SmallSidebar from "@/components/Navigation/SmallSidebar";

interface DecodedToken {
  user_id?: string;
  username?: string;
  email?: string;
}

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (accessToken && refreshToken && !isAuthenticated) {
      try {
        const decodedToken: DecodedToken = jwtDecode(accessToken);

        dispatch(
          setAuth({
            tokens: {
              access: accessToken,
              refresh: refreshToken,
            },
            user: {
              id: decodedToken.user_id || null,
              username: decodedToken.username || "Guest",
              email: decodedToken.email || null,
            },
            isAuthenticated: true,
          })
        );
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch(logout());
      }
    } else if (!accessToken || !refreshToken) {
      dispatch(logout());
      router.push("/signin");
    }
  }, [isAuthenticated, dispatch, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section>
      <main className="relative h-full w-full flex">
        {isMobile ? (
          <SmallSidebar
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
          />
        ) : (
          <BigSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        )}
        <div
          className={`flex-1 transition-all duration-300 ${
            showSidebar && !isMobile ? "ml-64" : "ml-0"
          }`}
        >
          <AdminNav toggleSidebar={toggleSidebar} />
          <div className="w-[90vw] md:w-[80vw] mx-auto py-1">
            <div>{children}</div>
          </div>
        </div>
      </main>
    </section>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/reducers/store";
// import { setAuth, logout } from "@/reducers/authSlice";
// import { jwtDecode } from "jwt-decode";
// import { useRouter } from "next/navigation";

// import AdminNav from "@/components/Navigation/AdminNav";
// import BigSidebar from "@/components/Navigation/BigSidebar";
// import SmallSidebar from "@/components/Navigation/SmallSidebar";

// export default function SharedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const isAuthenticated = useSelector(
//     (state: RootState) => state.auth.isAuthenticated
//   );
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const toggleSidebar = () => setShowSidebar(!showSidebar);

//   // Track screen size for responsive design
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Check if the user has valid tokens
//   useEffect(() => {
//     const accessToken = Cookies.get("access_token");
//     const refreshToken = Cookies.get("refresh_token");

//     if (accessToken && refreshToken && !isAuthenticated) {
//       try {
//         const decodedToken: any = jwtDecode(accessToken);

//         dispatch(
//           setAuth({
//             tokens: {
//               access: accessToken,
//               refresh: refreshToken,
//             },
//             user: {
//               id: decodedToken?.user_id || null,
//               username: decodedToken?.username || "Guest",
//               email: decodedToken?.email || null,
//             },
//             isAuthenticated: true,
//           })
//         );
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         dispatch(logout());
//       }
//     } else if (!accessToken || !refreshToken) {
//       dispatch(logout());
//       router.push("/signin"); // Redirect to sign-in page if no tokens
//     }
//   }, [isAuthenticated, dispatch, router]);

//   if (!isAuthenticated) {
//     return null; // Optionally, you can return a loading spinner or something else while the check is happening
//   }

//   return (
//     <section>
//       <main className="relative h-full w-full  flex">
//         {/* Conditionally render sidebars */}
//         {isMobile ? (
//           <SmallSidebar
//             showSidebar={showSidebar}
//             toggleSidebar={toggleSidebar}
//           />
//         ) : (
//           <BigSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
//         )}
//         <div
//           className={`flex-1 transition-all duration-300 ${
//             showSidebar && !isMobile ? "ml-64" : "ml-0"
//           }`}
//         >
//           <AdminNav toggleSidebar={toggleSidebar} />
//           <div className="w-[90vw] md:w-[80vw] mx-auto py-1">
//             <div>{children}</div>
//           </div>
//         </div>
//       </main>
//     </section>
//   );
// }
