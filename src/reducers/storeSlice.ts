import { Offering, Store, StoreData, StoreState } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Initial state
const initialState: StoreState = {
  stores: [],
  selectedStore: null,
  loading: false,
  error: null,
  store: null,
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/refresh/`,
      {
        refresh: Cookies.get("refresh_token"),
      }
    );
    const { access } = response.data;
    Cookies.set("access_token", access);
    return access;
  } catch {
    throw new Error("Failed to refresh access token");
  }
};

// Async thunks

// Assuming you're using js-cookie to manage cookies

export const addStore = createAsyncThunk(
  "stores/addStore",
  async (storeData: StoreData, thunkAPI) => {
    try {
      // Retrieve the token from cookies (or wherever it's stored)
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      // Log the access token to ensure it's being retrieved
      console.log("Access Token:", accessToken);

      // Send the request with the token in the Authorization header
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/`,
        storeData, // This should now be a FormData object
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data", // Use multipart for file uploads
          },
        }
      );

      // Log the response to see if the request is successful
      console.log("Store created:", response.data);

      return response.data; // Returning the store data from the response
    } catch (error) {
      // Check if the error is an Axios error and has a response
      if (axios.isAxiosError(error) && error.response) {
        console.log("Error Response:", error.response); // Log the full response for debugging

        // If the error is a 401 Unauthorized, it might be an issue with the token
        if (error.response.status === 401) {
          return thunkAPI.rejectWithValue("Unauthorized access - Token issue");
        }

        // Handle any other errors from the server
        return thunkAPI.rejectWithValue(
          error.response.data.message || "An error occurred"
        );
      }

      // If the error is not Axios-specific, return a general error
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Fetch stores by wedding category and store ID
export const fetchStoresByWeddingCategory = createAsyncThunk(
  "stores/fetchStoresByWeddingCategory",
  async ({
    weddingCategory,
    storeId,
  }: {
    weddingCategory: string;
    storeId: string;
  }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}?category=${weddingCategory}`
      );
      return response.data as Store;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred while fetching store data.");
    }
  }
);

// Fetch all stores with offerings
export const fetchStoresWithOfferings = createAsyncThunk(
  "stores/fetchStoresWithOfferings",
  async (storeId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/`
      );
      return response.data as Store[]; // Ensure the API response matches the Store type
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Fetch store by ID
export const fetchStoreById = createAsyncThunk(
  "stores/fetchStoreById",
  async (storeId: number, thunkAPI) => {
    let accessToken = Cookies.get("access_token");
    if (!accessToken) {
      return thunkAPI.rejectWithValue("User not authenticated");
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("fetcing store by id", response.data);
      return response.data as Store;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        // Token expired, try to refresh
        try {
          accessToken = await refreshAccessToken();
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store_list/${storeId}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          return response.data as Store;
        } catch {
          return thunkAPI.rejectWithValue("Failed to refresh access token");
        }
      }
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Fetch offerings by store ID
export const fetchOfferingsByStoreId = createAsyncThunk(
  "stores/fetchOfferingsByStoreId",
  async (storeId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store_list/${storeId}/offerings`
      );
      return response.data as Offering[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Fetch stores by user ID
export const fetchStoresByUserId = createAsyncThunk(
  "stores/fetchStoresByUserId",
  async (storeId: string, thunkAPI) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      return thunkAPI.rejectWithValue("User not authenticated");
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store_list/${storeId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Fetched stores for user: ", response.data);
      return response.data as Store[]; // Return the stores
    } catch (error) {
      console.error("Error fetching stores:", error);
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Update an existing store

export const updateStore = createAsyncThunk(
  "stores/updateStore",
  async (
    { storeId, storeData }: { storeId: string; storeData: StoreData },
    thunkAPI
  ) => {
    try {
      // Retrieve the token from cookies
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      // Log the access token to ensure it's being retrieved
      console.log("Access Token:", accessToken);

      // Ensure storeData is of the correct type (i.e., FormData or JSON)
      const isFormData = storeData instanceof FormData;

      console.log("Store Data in hook:", storeData);
      // Send the request with the token in the Authorization header
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}/`,
        storeData, // This should be the storeData (either FormData or JSON)
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": isFormData
              ? "multipart/form-data"
              : "application/json", // Adjust content-type based on the type
          },
        }
      );

      // Log the response to see if the request is successful
      console.log("Store updated:", response.data);

      return response.data; // Return the updated store data from the response
    } catch (error) {
      // Check if the error is an Axios error and has a response
      if (axios.isAxiosError(error) && error.response) {
        console.log("Error Response:", error.response); // Log the full response for debugging

        // Handle 401 Unauthorized - Token issues
        if (error.response.status === 401) {
          return thunkAPI.rejectWithValue("Unauthorized access - Token issue");
        }

        // Handle any other errors from the server
        return thunkAPI.rejectWithValue(
          error.response.data.message || "An error occurred"
        );
      }

      // Handle unexpected errors that are not Axios-specific
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Partial update a store
export const partialUpdateStore = createAsyncThunk(
  "stores/partialUpdateStore",
  async (
    { storeId, partialData }: { storeId: string; partialData: Partial<Store> },
    thunkAPI
  ) => {
    try {
      // Retrieve the token from cookies (or wherever it's stored)
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      // Log the access token to ensure it's being retrieved
      console.log("Access Token:", accessToken);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}/`,
        partialData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Ensure the correct content type
          },
        }
      );
      return response.data as Store; // Return the updated store
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteStore = createAsyncThunk(
  "stores/deleteStore",
  async (storeId: string, thunkAPI) => {
    try {
      // Retrieve the token from cookies (or wherever it's stored)
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Ensure the correct content type
          },
        }
      );
      return storeId; // Return store ID to be deleted for state updates
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice
const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Stores
    builder.addCase(fetchStoresByWeddingCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchStoresByWeddingCategory.fulfilled,
      (state, action: PayloadAction<Store>) => {
        state.loading = false;
        state.selectedStore = action.payload; // Set the fetched store
      }
    );
    builder.addCase(fetchStoresByWeddingCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null; // Store error message
    });

    builder.addCase(fetchStoresWithOfferings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchStoresWithOfferings.fulfilled,
      (state, action: PayloadAction<Store[]>) => {
        state.loading = false;
        state.stores = action.payload;
        console.log("Fetched stores: ", action.payload);
      }
    );
    builder.addCase(fetchStoresWithOfferings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Store By ID
    builder.addCase(fetchStoreById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStoreById.fulfilled, (state, action) => {
      state.store = action.payload; // Store the fetched data
      state.loading = false;
    });
    builder.addCase(fetchStoreById.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    // Fetch Offerings By Store ID
    builder.addCase(fetchOfferingsByStoreId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchOfferingsByStoreId.fulfilled,
      (state, action: PayloadAction<Offering[]>) => {
        if (state.selectedStore) {
          state.selectedStore.offerings = action.payload;
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchOfferingsByStoreId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Store
    // Fetch Stores and other actions (as already done in your slice)
    builder.addCase(addStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addStore.fulfilled,
      (state, action: PayloadAction<Store>) => {
        state.loading = false;
        state.stores.push(action.payload); // Add the new store to the list
      }
    );
    builder.addCase(addStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string; // Handle error and set it in the state
    });

    // Update Store
    builder.addCase(updateStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateStore.fulfilled,
      (state, action: PayloadAction<Store>) => {
        state.loading = false;
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id
        );
        if (index !== -1) {
          state.stores[index] = action.payload; // Update the store in the list
        }
      }
    );
    builder.addCase(updateStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Store
    builder.addCase(deleteStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      deleteStore.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.stores = state.stores.filter(
          (store) => store.id !== Number(action.payload) // Ensure type consistency
        );
      }
    );

    builder.addCase(deleteStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch stores by user ID
    builder.addCase(fetchStoresByUserId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchStoresByUserId.fulfilled,
      (state, action: PayloadAction<Store[]>) => {
        state.loading = false;
        state.stores = action.payload; // Update stores with data fetched by user ID
      }
    );
    builder.addCase(fetchStoresByUserId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(partialUpdateStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      partialUpdateStore.fulfilled,
      (state, action: PayloadAction<Store>) => {
        state.loading = false;
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id
        );
        if (index !== -1) {
          state.stores[index] = {
            ...state.stores[index],
            ...action.payload, // Merge the updated fields with the existing store data
          };
        }
      }
    );

    builder.addCase(partialUpdateStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const storeReducer = storeSlice.reducer;
