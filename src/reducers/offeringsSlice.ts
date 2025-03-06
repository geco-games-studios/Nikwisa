import { Offering } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie for token handling

// Defining types locally in the slice for clarity

export interface OfferingState {
  offerings: Offering[];
  loading: boolean;
  error: string | null;
}

// Initial state for offerings
const initialState: OfferingState = {
  offerings: [],
  loading: false,
  error: null,
};

// Async thunks

// Fetch offering by ID
export const fetchOfferingById = createAsyncThunk(
  "offerings/fetchOfferingById",
  async (offeringId: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/offerings/${offeringId}/`
      );
      return response.data as Offering;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Fetch offerings by store ID
export const fetchOfferingsByStoreId = createAsyncThunk(
  "offerings/fetchOfferingsByStoreId",
  async (storeId: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store_list/${storeId}/offerings/`
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

// Add a new offering
export const addOffering = createAsyncThunk(
  "offerings/addOffering",
  async (offeringData: FormData, thunkAPI) => {
    // Use FormData type if you are uploading files
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        console.error("Access token is missing");
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/offerings/`,
        offeringData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Do not manually set Content-Type for FormData
          },
        }
      );
      return response.data as Offering;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Update an existing offering (partial edit)
export const updateOffering = createAsyncThunk(
  "offerings/updateOffering",
  async (
    {
      offeringId,
      offeringData,
    }: { offeringId: number; offeringData: Partial<Offering> },
    thunkAPI
  ) => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        console.error("Access token is missing");
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/offerings/${offeringId}/`,
        offeringData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data as Offering;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Delete an offering
export const deleteOffering = createAsyncThunk(
  "offerings/deleteOffering",
  async (offeringId: number, thunkAPI) => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        console.error("Access token is missing");
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/offerings/${offeringId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return offeringId; // Return offering ID to be deleted for state updates
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice
const offeringsSlice = createSlice({
  name: "offerings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Offering by ID
    builder.addCase(fetchOfferingById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchOfferingById.fulfilled,
      (state, action: PayloadAction<Offering>) => {
        state.loading = false;
        const index = state.offerings.findIndex(
          (offering) => offering.id === action.payload.id
        );
        if (index === -1) {
          state.offerings.push(action.payload);
        } else {
          state.offerings[index] = action.payload;
        }
      }
    );
    builder.addCase(fetchOfferingById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Offerings by Store ID
    builder.addCase(fetchOfferingsByStoreId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchOfferingsByStoreId.fulfilled,
      (state, action: PayloadAction<Offering[]>) => {
        state.loading = false;
        state.offerings = action.payload;
      }
    );
    builder.addCase(fetchOfferingsByStoreId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Offering
    builder.addCase(addOffering.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addOffering.fulfilled,
      (state, action: PayloadAction<Offering>) => {
        state.loading = false;
        state.offerings.push(action.payload);
      }
    );
    builder.addCase(addOffering.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Offering
    builder.addCase(updateOffering.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateOffering.fulfilled,
      (state, action: PayloadAction<Offering>) => {
        state.loading = false;
        const index = state.offerings.findIndex(
          (offering) => offering.id === action.payload.id
        );
        if (index !== -1) {
          state.offerings[index] = {
            ...state.offerings[index],
            ...action.payload,
          };
        }
      }
    );
    builder.addCase(updateOffering.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Offering
    builder.addCase(deleteOffering.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteOffering.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.offerings = state.offerings.filter(
          (offering) => offering.id !== action.payload
        );
      }
    );
    builder.addCase(deleteOffering.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const offeringsReducer = offeringsSlice.reducer;
