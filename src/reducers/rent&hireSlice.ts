import { RentHireState } from "@/types/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: RentHireState = {
  rent_hire_categories: [], // No rent/hire categories loaded at the beginning
  stores: [], // Initially, no stores are available
  rent_hire_subcategories: [], // No rent/hire subcategories loaded at the start
  rent_hire_subcategory_details: null, // Details of a specific rent/hire subcategory will be null initially
  status: "idle", // Initial status is idle, indicating no action is in progress
  error: null, // No errors initially
};

// Fetch all rent/hire subcategories with related categories
export const fetchRentHireSubcategories = createAsyncThunk(
  "rentHireProduct/fetchRentHireSubcategories",
  async () => {
    try {
      console.log("Fetching all rent/hire subcategories");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/rentubcategory/`
      );
      console.log("Rent/hire subcategories API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching rent/hire subcategories:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(
          error.response.data.message ||
            "Failed to fetch rent/hire subcategories"
        );
      }
      throw error;
    }
  }
);

// Fetch rent/hire subcategory details by ID
export const fetchRentHireSubcategoryById = createAsyncThunk(
  "rentHireProduct/fetchRentHireSubcategoryById",
  async (subcategoryId: number) => {
    try {
      console.log(`Fetching rent/hire subcategory with ID: ${subcategoryId}`);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/rentsubcategory/${subcategoryId}/`
      );
      console.log("Rent/hire subcategory details API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching rent/hire subcategory by ID:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(
          error.response.data.message ||
            "Failed to fetch rent/hire subcategory details"
        );
      }
      throw error;
    }
  }
);

// Fetch all rent/hire categories
export const fetchRentHireCategories = createAsyncThunk(
  "rentHireProduct/fetchRentHireCategories",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/rentcategory/`
      );
      console.log("Rent/hire categories API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching rent/hire categories:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(
          error.response.data.message || "Failed to fetch rent/hire categories"
        );
      }
      throw error;
    }
  }
);

// Fetch stores with offerings
export const fetchStoresWithRentHireOfferings = createAsyncThunk(
  "rentHireProduct/fetchStoresWithRentHireOfferings",
  async () => {
    try {
      console.log("Fetching stores with rent/hire offerings");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/`
      );
      console.log("Stores API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching stores:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(error.response.data.message || "Failed to fetch stores");
      }
      throw error;
    }
  }
);

const rentHireSlice = createSlice({
  name: "rentHireProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all rent/hire subcategories
      .addCase(fetchRentHireSubcategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRentHireSubcategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rent_hire_subcategories = action.payload;
      })
      .addCase(fetchRentHireSubcategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Fetch rent/hire subcategory by ID
      .addCase(fetchRentHireSubcategoryById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRentHireSubcategoryById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rent_hire_subcategory_details = action.payload;
      })
      .addCase(fetchRentHireSubcategoryById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Fetch rent/hire categories
      .addCase(fetchRentHireCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRentHireCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rent_hire_categories = action.payload;
      })
      .addCase(fetchRentHireCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Fetch stores with rent/hire offerings
      .addCase(fetchStoresWithRentHireOfferings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStoresWithRentHireOfferings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stores = action.payload;
      })
      .addCase(fetchStoresWithRentHireOfferings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export default rentHireSlice.reducer;
