import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  taskers: [] as { id: number; name: string; email: string; phone: string }[],
  loading: false,
  error: null as string | null,
};

const fetchTaskers = createAsyncThunk("taskers/fetchTaskers", async () => {
  const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const response = await axios.get(`${baseURL}/services/`);
  return response.data;
});

const deleteTasker = createAsyncThunk(
  "taskers/deleteTasker",
  async (id: number) => {
    const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;
    await axios.delete(`${baseURL}/taskers/${id}`);
    return id;
  }
);

const taskSlice = createSlice({
  name: "taskers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskers.fulfilled, (state, action) => {
        state.loading = false;
        state.taskers = action.payload.results; // Extract taskers from results
      })
      .addCase(fetchTaskers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch taskers";
      })

      .addCase(deleteTasker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTasker.fulfilled, (state, action) => {
        state.loading = false;
        state.taskers = state.taskers.filter(
          (tasker) => tasker.id !== action.payload
        );
      })
      .addCase(deleteTasker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete tasker";
      });
  },
});

export default taskSlice.reducer;
export { fetchTaskers, deleteTasker, initialState };
