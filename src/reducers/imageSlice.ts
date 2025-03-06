import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types based on the image data structure from the backend
export interface ImageData {
  id: number;
  store: number;
  uploaded_at: string;
  image: string;
}

export interface ImageState {
  images: ImageData[]; // Store the list of images
  loading: boolean;
  error: string | null;
}

// Initial state for images
const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
};

// Async thunks

// Fetch all images for a store
export const fetchImagesByStoreId = createAsyncThunk(
  "images/fetchImagesByStoreId",
  async (storeId: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store/${storeId}/images`
      );
      return response.data as ImageData[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Add a new image
export const addImage = createAsyncThunk(
  "images/addImage",
  async (imageData: FormData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store_images/`,
        imageData
      );
      return response.data as ImageData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Delete an image
export const deleteImage = createAsyncThunk(
  "images/deleteImage",
  async (imageId: number, thunkAPI) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store_images/${imageId}`
      );
      return imageId; // Return the image ID to be deleted for state updates
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Upload multiple images
export const uploadMultipleImages = createAsyncThunk(
  "images/uploadMultipleImages",
  async (
    { storeId, images }: { storeId: number; images: FormData },
    thunkAPI
  ) => {
    try {
      images.append("store_id", storeId.toString());

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/store/${storeId}/images/upload-multiple-images/`,
        images,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      console.log("Backend Response Data:", data); // Debugging

      // Check if the response contains a success message
      if (data && data.detail && typeof data.detail === "string") {
        // If there's a success message, return an empty array to indicate success
        return [];
      }

      // If the response contains an array of images, return it
      if (Array.isArray(data)) {
        return data;
      } else if (data.images && Array.isArray(data.images)) {
        return data.images;
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice
const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Images by Store ID
    builder.addCase(fetchImagesByStoreId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchImagesByStoreId.fulfilled,
      (state, action: PayloadAction<ImageData[]>) => {
        state.loading = false;
        state.images = action.payload; // Set the fetched images
      }
    );
    builder.addCase(fetchImagesByStoreId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Image
    builder.addCase(addImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addImage.fulfilled,
      (state, action: PayloadAction<ImageData>) => {
        state.loading = false;
        state.images.push(action.payload); // Add the new image to the list
      }
    );
    builder.addCase(addImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Image
    builder.addCase(deleteImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteImage.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.images = state.images.filter(
          (image) => image.id !== action.payload
        ); // Remove the deleted image from the list
      }
    );
    builder.addCase(deleteImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(uploadMultipleImages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadMultipleImages.fulfilled, (state) => {
      state.loading = false;
      state.error = null; // Reset error state on success
    });
    builder.addCase(uploadMultipleImages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetError, resetLoading } = imagesSlice.actions;
export const imagesReducer = imagesSlice.reducer;
