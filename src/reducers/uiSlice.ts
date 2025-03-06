// slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarVisible: true, // Sidebar is visible by default
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible;
    },
  },
});

export const { toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
