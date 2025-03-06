import { User } from "@/types/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  users: User[];
}

const initialState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  users: [],
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      const decoded: { id: number; username: string; email: string } =
        jwtDecode(data.access);

      // Set user data in the store
      Cookies.set("access_token", data.access);
      Cookies.set("refresh_token", data.refresh);

      return {
        user: decoded,
        tokens: {
          access: data.access,
          refresh: data.refresh,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      email,
      password,
      phone_number,
      role = "client",
    }: {
      username: string;
      email: string;
      password: string;
      phone_number: string;
      role?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
            phone_number,
            role,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const accessToken = state.auth.accessToken;
      if (!accessToken) throw new Error("No access token available");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      Cookies.set("access_token", data.access);
      return data.access;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const accessToken = state.auth.accessToken;
      if (!accessToken) throw new Error("No access token available");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (userId: number, thunkAPI) => {
    try {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          return thunkAPI.rejectWithValue("Unauthorized access - Token issue");
        }

        return thunkAPI.rejectWithValue(
          error.response.data.message || "An error occurred"
        );
      }

      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { userId, userData }: { userId: number; userData: FormData },
    thunkAPI
  ) => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data as User;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(
          error.response.data.message || "Failed to update profile"
        );
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    setAuth: (state, action) => {
      state.accessToken = action.payload.tokens.access;
      state.refreshToken = action.payload.tokens.refresh;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in state after successful profile update
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;

// import { User } from "@/types/types";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// interface AuthState {
//   loading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
//   accessToken: string | null;
//   refreshToken: string | null;
//   user: User | null; // <-- Change this to use User interface
//   users: User[];
// }

// const initialState: AuthState = {
//   loading: false,
//   error: null,
//   isAuthenticated: false,
//   accessToken: null,
//   refreshToken: null,
//   user: null, // This should now match the full User structure
//   users: [],
// };

// // Inside the loginUser async thunk:
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (
//     { username, password }: { username: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/login/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Invalid username or password");
//       }

//       const data = await response.json();
//       const decoded: { id: number; username: string; email: string } =
//         jwtDecode(data.access); // Decode the access token to get user info

//       // Set user data in the store
//       Cookies.set("access_token", data.access);
//       Cookies.set("refresh_token", data.refresh);

//       return {
//         user: decoded, // Assuming the decoded token contains user data
//         tokens: {
//           access: data.access,
//           refresh: data.refresh,
//         },
//       };
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (
//     {
//       username,
//       email,
//       password,
//       phone_number,
//       role = "client",
//     }: {
//       username: string;
//       email: string;
//       password: string;
//       phone_number: string;
//       role?: string;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username,
//             email,
//             password,
//             phone_number,
//             role,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Registration failed");
//       }

//       const data = await response.json();
//       return data;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Async Thunk for fetching user info
// export const fetchUser = createAsyncThunk(
//   "auth/fetchUser",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as { auth: AuthState };
//       const accessToken = state.auth.accessToken;
//       if (!accessToken) throw new Error("No access token available");

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch user");
//       }

//       return await response.json();
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Async Thunk for refreshing tokens
// export const refreshToken = createAsyncThunk(
//   "auth/refreshToken",
//   async (_, { rejectWithValue }) => {
//     try {
//       const refreshToken = Cookies.get("refresh_token");

//       if (!refreshToken) {
//         throw new Error("No refresh token available");
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/token/refresh/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refresh: refreshToken }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to refresh token");
//       }

//       const data = await response.json();
//       Cookies.set("access_token", data.access);
//       return data.access;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Fetch all users
// export const fetchAllUsers = createAsyncThunk(
//   "auth/fetchAllUsers",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as { auth: AuthState };
//       const accessToken = state.auth.accessToken;
//       if (!accessToken) throw new Error("No access token available");

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch users");
//       }

//       return await response.json();
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Fetch user by ID
// export const fetchUserById = createAsyncThunk(
//   "auth/fetchUserById",
//   async (userId: number, thunkAPI) => {
//     try {
//       const accessToken = Cookies.get("access_token");

//       if (!accessToken) {
//         return thunkAPI.rejectWithValue("User not authenticated");
//       }

//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       console.log("User fetched:", response.data);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         console.log("Error Response:", error.response);

//         if (error.response.status === 401) {
//           return thunkAPI.rejectWithValue("Unauthorized access - Token issue");
//         }

//         return thunkAPI.rejectWithValue(
//           error.response.data.message || "An error occurred"
//         );
//       }

//       return thunkAPI.rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const updateProfile = createAsyncThunk(
//   "auth/updateProfile",
//   async (
//     { userId, userData }: { userId: number; userData: FormData },
//     thunkAPI
//   ) => {
//     try {
//       const accessToken = Cookies.get("access_token");
//       if (!accessToken) {
//         console.error("Access token is missing");
//         return thunkAPI.rejectWithValue("User not authenticated");
//       }
//       const response = await axios.patch(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}/`,
//         userData, // No need to cast to 'any'
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response.data as User;
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         return thunkAPI.rejectWithValue(error.response.data.message);
//       }
//       return thunkAPI.rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // export const updateProfile = createAsyncThunk(
// //   "auth/updateProfile",
// //   async (
// //     { userId, userData }: { userId: number; userData: Partial<User> },
// //     thunkAPI
// //   ) => {
// //     try {
// //       const accessToken = Cookies.get("access_token");
// //       if (!accessToken) {
// //         console.error("Access token is missing");
// //         return thunkAPI.rejectWithValue("User not authenticated");
// //       }
// //       const response = await axios.patch(
// //         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}/`,
// //         userData,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${accessToken}`,
// //             "Content-Type": "multipart/form-data",
// //           },
// //         }
// //       );
// //       return response.data as User;
// //     } catch (error) {
// //       if (axios.isAxiosError(error) && error.response) {
// //         return thunkAPI.rejectWithValue(error.response.data.message);
// //       }
// //       return thunkAPI.rejectWithValue("An unknown error occurred");
// //     }
// //   }
// // );
// // Slice definition
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       Cookies.remove("access_token");
//       Cookies.remove("refresh_token");
//       state.isAuthenticated = false;
//       state.accessToken = null;
//       state.refreshToken = null;
//       state.user = null;
//     },
//     setAuth: (state, action) => {
//       state.accessToken = action.payload.tokens.access;
//       state.refreshToken = action.payload.tokens.refresh;
//       state.user = action.payload.user;
//       state.isAuthenticated = true;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//         state.accessToken = action.payload.tokens.access;
//         state.refreshToken = action.payload.tokens.refresh;
//         state.user = action.payload.user;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Fetch User
//       .addCase(fetchUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Refresh Token
//       .addCase(refreshToken.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(refreshToken.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload.access;
//       })
//       .addCase(refreshToken.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchAllUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchAllUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchUserById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUserById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Update Profile
//       .addCase(updateProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         // Update user in state after successful profile update
//         state.user = action.payload;
//       })
//       .addCase(updateProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { logout, setAuth } = authSlice.actions;
// export default authSlice.reducer;
