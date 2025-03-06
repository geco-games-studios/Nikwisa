// import { SearchResult } from "@/types/types";
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// // Initial state

// export interface StoreState {

//   results: unknown[]; // or the appropriate type for results

//   loading: boolean;

//   error: string | null;

//   // other properties

// }

// export const searchStores = createAsyncThunk(
//   "search/searchStores",
//   async (
//     { query, location }: { query: string; location: string },
//     thunkAPI
//   ) => {
//     const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/search/`;

//     // Change 'query' to 'q' here
//     const params = { q: query, location };

//     try {
//       const response = await axios.get(url, { params });
//       return response.data as SearchResult[];
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         return thunkAPI.rejectWithValue(error.response.data.message);
//       }
//       return thunkAPI.rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Slice
// const searchSlice = createSlice({
//   name: "search",
//   initialState,
//   reducers: {
//     // Clear results
//     clearResults(state) {
//       state.results = [];
//     },
//     // Clear error
//     clearError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Handle search pending
//     builder.addCase(searchStores.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });

//     // Handle search fulfilled
//     builder.addCase(
//       searchStores.fulfilled,
//       (state, action: PayloadAction<SearchResult[]>) => {
//         state.loading = false;
//         state.results = action.payload;
//       }
//     );

//     // Handle search rejected
//     builder.addCase(searchStores.rejected, (state, action) => {
//       state.loading = false;
//       state.error = (action.payload as string) || "Something went wrong";
//     });
//   },
// });

// // Export actions
// export const { clearResults, clearError } = searchSlice.actions;

// // Export the reducer
// export const searchReducer = searchSlice.reducer;
