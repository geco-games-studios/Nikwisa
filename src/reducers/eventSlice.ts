import { EvenPlanningProductState } from "@/types/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: EvenPlanningProductState = {
  product: null, // Initially, no product is selected
  event_categories: [], // No event categories loaded at the beginning
  stores: [], // Initially, no stores are available
  event_subcategories: [], // No event subcategories loaded at the start
  event_subcategory_details: null, // Details of a specific event subcategory will be null initially
  status: "idle", // Initial status is idle, indicating no action is in progress
  error: null, // No errors initially
};

// Fetch all event subcategories with related categories
export const fetchEventSubcategories = createAsyncThunk(
  "eventProduct/fetchEventSubcategories",
  async () => {
    try {
      console.log("Fetching all event subcategories");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/eventsubcategory/`
      );
      console.log("Event subcategories API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event subcategories:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(
          error.response.data.message || "Failed to fetch event subcategories"
        );
      }
      throw error;
    }
  }
);

// Fetch event subcategory details by ID
export const fetchEventSubcategoryById = createAsyncThunk(
  "eventProduct/fetchEventSubcategoryById",
  async (subcategoryId: number) => {
    try {
      console.log(`Fetching event subcategory with ID: ${subcategoryId}`);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/eventsubcategory/${subcategoryId}/`
      );
      console.log("Event subcategory details API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event subcategory by ID:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(
          error.response.data.message ||
            "Failed to fetch event subcategory details"
        );
      }
      throw error;
    }
  }
);

// Fetch all event categories
export const fetchEventCategories = createAsyncThunk(
  "eventProduct/fetchEventCategories",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/eventcategory/`
      );
      console.log(" event_categories API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event_categories:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(
          error.response.data.message || "Failed to fetch  event_categories"
        );
      }
      throw error;
    }
  }
);

// Fetch stores with offerings
export const fetchStoresWithOfferings = createAsyncThunk(
  "eventProduct/fetchStoresWithOfferings",
  async () => {
    try {
      console.log("Fetching stores with offerings");
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

export const fetchEventCategoriesByCategory = createAsyncThunk(
  "eventProduct/fetchEventCategoriesByCategory",
  async (categoryIds: number[]) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/eventcategory/`,
        {
          params: {
            category_id: categoryIds.join(","), // Pass category IDs as a comma-separated string
          },
        }
      );
      console.log("Filtered event categories API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event categories by category:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw Error(
          error.response.data.message ||
            "Failed to fetch event categories by category"
        );
      }
      throw error;
    }
  }
);

const eventSlice = createSlice({
  name: "eventProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all event subcategories
      .addCase(fetchEventSubcategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventSubcategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.event_subcategories = action.payload;
      })
      .addCase(fetchEventSubcategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Fetch event subcategory by ID
      .addCase(fetchEventSubcategoryById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventSubcategoryById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.event_subcategory_details = action.payload;
      })
      .addCase(fetchEventSubcategoryById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Fetch event categories
      .addCase(fetchEventCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.event_categories = action.payload;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Fetch stores with offerings
      .addCase(fetchStoresWithOfferings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStoresWithOfferings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stores = action.payload;
      })
      .addCase(fetchStoresWithOfferings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      // Fetch event categories by category
      .addCase(fetchEventCategoriesByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventCategoriesByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.event_categories = action.payload; // Update state with filtered event categories
      })
      .addCase(fetchEventCategoriesByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export default eventSlice.reducer;

// import { EvenPlanningProductState } from "@/types/types";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState: EvenPlanningProductState = {
//   product: null,
//   event_categories: [],
//   stores: [], // Add stores to the state
//   status: "idle",
//   error: null,
// };

// export const fetchEventProduct = createAsyncThunk(
//   "eventProduct/fetchEventProduct",
//   async () => {
//     try {
//       console.log("Fetching all eevnt planning products");
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/eventcategory/`
//       );
//       console.log("API response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         throw Error(
//           error.response.data.message ||
//             "Failed to fetch event planning products"
//         );
//       }
//       throw error;
//     }
//   }
// );

// export const fetchEventCategories = createAsyncThunk(
//   "eventProduct/fetchEventCategories",
//   async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/eventcategory/`
//       );
//       console.log(" event_categories API response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching event_categories:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         throw Error(
//           error.response.data.message || "Failed to fetch  event_categories"
//         );
//       }
//       throw error;
//     }
//   }
// );

// // Fetch stores with offerings
// export const fetchStoresWithOfferings = createAsyncThunk(
//   "eventProduct/fetchStoresWithOfferings",
//   async () => {
//     try {
//       console.log("Fetching stores with offerings");
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/`
//       );
//       console.log("Stores API response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching stores:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         throw Error(error.response.data.message || "Failed to fetch stores");
//       }
//       throw error;
//     }
//   }
// );

// const eventSlice = createSlice({
//   name: "eventProduct",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEventProduct.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchEventProduct.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.product = action.payload;
//       })
//       .addCase(fetchEventProduct.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message ?? null;
//       })
//       .addCase(fetchEventCategories.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchEventCategories.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.event_categories = action.payload;
//       })
//       .addCase(fetchEventCategories.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message ?? null;
//       })
//       .addCase(fetchStoresWithOfferings.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchStoresWithOfferings.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.stores = action.payload;
//       })
//       .addCase(fetchStoresWithOfferings.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message ?? null;
//       });
//   },
// });

// export default eventSlice.reducer;

// import { Category, WeddingProduct, WeddingProductState } from "@/types/types";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState: WeddingProductState = {
//   product: null,
//   event_categories: [],
//   status: "idle",
//   error: null,
// };

// export const fetchEventProduct = createAsyncThunk(
//   "weddingProduct/fetchEventProduct",
//   async () => {
//     try {
//       console.log("Fetching all event planning products");
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/weddings/`
//       );
//       console.log("API response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         throw Error(
//           error.response.data.message || "Failed to fetch event planning products"
//         );
//       }
//       throw error;
//     }
//   }
// );

// export const fetchEventCategories = createAsyncThunk(
//   "weddingProduct/fetchEventCategories",
//   async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_ENDPOINT}/weddingscategory/`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching event_categories:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         throw Error(
//           error.response.data.message || "Failed to fetch event planning event_categories"
//         );
//       }
//       throw error;
//     }
//   }
// );

// const weddingSlice = createSlice({
//   name: "weddingProduct",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEventProduct.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchEventProduct.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.product = action.payload;
//       })
//       .addCase(fetchEventProduct.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message ?? null;
//       })
//       .addCase(fetchEventCategories.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchEventCategories.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.event_categories = action.payload;
//       })
//       .addCase(fetchEventCategories.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message ?? null;
//       });
//   },
// });

// export default weddingSlice.reducer;
