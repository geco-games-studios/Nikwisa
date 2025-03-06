import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchToken } from "../../utils/api";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/reducers/store";
import { fetchUserById } from "@/reducers/authSlice";
import { DecodedToken } from "@/types/types";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get user details from Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  console.log("user", user);

  const fetchUserData = useCallback(
    (token: string) => {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log("Decoded token:", decoded);

        if (decoded?.user_id) {
          dispatch(fetchUserById(decoded.user_id)); // Fetch user by ID
        }
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const token = Cookies.get("access_token");
    console.log("Token:", token);
    if (token) {
      fetchUserData(token);
    }
  }, [fetchUserData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { access, refresh } = await fetchToken(username, password);

      if (!access || !refresh) {
        throw new Error("No token found");
      }

      Cookies.set("access_token", access);
      Cookies.set("refresh_token", refresh);

      fetchUserData(access); // Fetch user after login

      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  console.log("logged in user", user);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] bg-white border-t-[5px] border-[#B88E2F] rounded-lg shadow-lg p-8 my-12 mx-auto"
      >
        <h3 className="text-center text-4xl font-semibold">Login</h3>

        {error && (
          <div className="mb-4 p-3 rounded-md text-center bg-red-100 text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-md text-center bg-green-100 text-green-800">
            {success}
          </div>
        )}

        <div className="form-row mt-6">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
            required
          />
        </div>

        <div className="form-row mt-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
            <div
              className="absolute right-3 top-3 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-[#B88E2F] text-white p-3 rounded-lg mt-6 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#B88E2F]"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between items-center mt-4">
          <button className="text-yellow-500 hover:underline text-sm">
            Forgot Password?
          </button>
        </div>

        <p className="text-center mt-4">
          <span className="text-slate-400">Not a member? </span>
          <a href="/signup" className="text-yellow-500 hover:underline">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { fetchToken } from "../../utils/api";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/reducers/store";
// import { fetchUserById } from "@/reducers/authSlice";
// import { DecodedToken } from "@/types/types";

// const LoginForm: React.FC = () => {
//   const router = useRouter();
//   const dispatch: AppDispatch = useDispatch();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   // const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Get user details from Redux store
//   const { user, loading } = useSelector(
//     (state: RootState) => state.auth
//   );

//   console.log("user", user);

//   useEffect(() => {
//     const token = Cookies.get("access_token");
//     console.log("Token:", token);
//     if (token) {
//       fetchUserData(token);
//     }
//   }, []);

//   const fetchUserData = (token: string) => {
//     try {
//       const decoded: DecodedToken = jwtDecode(token);
//       console.log("Decoded token:", decoded);

//       if (decoded?.user_id) {
//         dispatch(fetchUserById(decoded.user_id)); // Fetch user by ID
//       }
//     } catch (err) {
//       console.error("Failed to decode token", err);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const { access, refresh } = await fetchToken(username, password);

//       if (!access || !refresh) {
//         throw new Error("No token found");
//       }

//       Cookies.set("access_token", access);
//       Cookies.set("refresh_token", refresh);

//       fetchUserData(access); // Fetch user after login

//       setSuccess("Login successful! Redirecting to dashboard...");
//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 1000);
//     } catch (err: unknown) {
//       setError("Invalid username or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("logged in user", user);

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-[500px] bg-white border-t-[5px] border-[#B88E2F] rounded-lg shadow-lg p-8 my-12 mx-auto"
//       >
//         <h3 className="text-center text-4xl font-semibold">Login</h3>

//         {error && (
//           <div className="mb-4 p-3 rounded-md text-center bg-red-100 text-red-800">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 p-3 rounded-md text-center bg-green-100 text-green-800">
//             {success}
//           </div>
//         )}

//         <div className="form-row mt-6">
//           <label htmlFor="username" className="form-label">
//             Username
//           </label>
//           <input
//             type="text"
//             id="username"
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
//             value={username}
//             onChange={(e) => {
//               setUsername(e.target.value);
//               setError(null);
//             }}
//             required
//           />
//         </div>

//         <div className="form-row mt-6">
//           <label htmlFor="password" className="form-label">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 setError(null);
//               }}
//               required
//             />
//             <div
//               className="absolute right-3 top-3 text-gray-600 cursor-pointer"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className={`w-full bg-[#B88E2F] text-white p-3 rounded-lg mt-6 ${
//             loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#B88E2F]"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <div className="flex justify-between items-center mt-4">
//           <button className="text-yellow-500 hover:underline text-sm">
//             Forgot Password?
//           </button>
//         </div>

//         <p className="text-center mt-4">
//           <span className="text-slate-400">Not a member? </span>
//           <a href="/signup" className="text-yellow-500 hover:underline">
//             Signup
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;
