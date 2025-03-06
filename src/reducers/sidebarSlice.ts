import { SidebarState } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SidebarState = {
  showSidebar: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
