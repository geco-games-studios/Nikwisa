import { CategoryState } from "@/types/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: CategoryState = {
  categories: [],
  status: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/categories/`
      );
      console.log("categories", response.data);
      return response.data; // Assuming response.data is an array of categories
    } catch (error) {
      console.error("Error fetching categories:", error); // Log the error
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.message || "Failed to fetch categories"
        );
      } else {
        throw new Error("Failed to fetch categories");
      }
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default categorySlice.reducer;
