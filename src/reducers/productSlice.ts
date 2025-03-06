import {
  FetchCategoriesPayload,
  FetchProductsPayload,
  Product,
  ProductState,
} from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { ReactNode } from 'react';

const initialState: ProductState = {
  products: [],
  topSellingProducts: [],
  categories: [],
  loading: false,
  error: null,
  selectedStore: null,
  selectedProduct: undefined,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/`
      );
      return response.data as FetchProductsPayload;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Async thunk for fetching a single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${productId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Async thunk for fetching products by store ID
export const fetchProductsByStoreId = createAsyncThunk(
  "products/fetchProductsByStoreId",
  async (storeId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}/products`
      );
      return response.data as FetchProductsPayload;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Async thunk for fetching top-selling products by store ID
export const fetchTopSellingProductsByStoreId = createAsyncThunk(
  "products/fetchTopSellingProductsByStoreId",
  async (storeId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}/top-selling-products`
      );
      return response.data as FetchProductsPayload;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Async thunk for adding a product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product: Omit<Product, "id">, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products`,
        product
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/categories`
      );
      return response.data as FetchCategoriesPayload;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<FetchProductsPayload>) => {
        state.loading = false;
        state.products = action.payload.results;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProductById.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      }
    );
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchProductsByStoreId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProductsByStoreId.fulfilled,
      (state, action: PayloadAction<FetchProductsPayload>) => {
        state.loading = false;
        state.products = action.payload.results;
      }
    );
    builder.addCase(fetchProductsByStoreId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchTopSellingProductsByStoreId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTopSellingProductsByStoreId.fulfilled,
      (state, action: PayloadAction<FetchProductsPayload>) => {
        state.loading = false;
        state.topSellingProducts = action.payload.results;
      }
    );
    builder.addCase(
      fetchTopSellingProductsByStoreId.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload);
      }
    );
    builder.addCase(addProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<FetchCategoriesPayload>) => {
        state.loading = false;
        state.categories = action.payload.results;
      }
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const productReducer = productSlice.reducer;

interface Store {
  id: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  reviews_count: number;
  productsCount: number;
}

interface FetchStoresPayload {
  results: Store[];
}

interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
  loading: boolean;
  error: string | null;
}

const initialStoreState: StoreState = {
  stores: [],
  selectedStore: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const fetchStoreById = createAsyncThunk(
  "stores/fetchStoreById",
  async (storeId: string, thunkAPI) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores/${storeId}`;
      console.log(`Fetching store by ID: ${url}`);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `Error fetching store by ID: ${error.response.status} - ${error.response.data.message}`
        );
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        console.error("An unknown error occurred");
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Slice
const storeSlice = createSlice({
  name: "store",
  initialState: initialStoreState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStores.pending, function (state) {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchStores.fulfilled,
      (state, action: PayloadAction<FetchStoresPayload>) => {
        state.loading = false;
        state.stores = action.payload.results;
      }
    );
    builder.addCase(fetchStores.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchStoreById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchStoreById.fulfilled,
      (state, action: PayloadAction<Store>) => {
        state.loading = false;
        state.selectedStore = action.payload;
      }
    );
    builder.addCase(fetchStoreById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const storeReducer = storeSlice.reducer;
