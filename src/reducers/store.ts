import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { storeReducer } from "./storeSlice";
import { productReducer } from "./productSlice";
import authReducer from "./authSlice";
import taskReducer from "./taskersSlice";
import eventReducer from "./eventSlice";
import rentHireReducer from "./rent&hireSlice";
import weddingcategoryReducer from "./categorySlice";
import uiReducer from "./uiSlice";
import sidebarReducer from "./sidebarSlice";
import { reviewsReducer } from "./reviewSlice";
import { offeringsReducer } from "./offeringsSlice";
import { imagesReducer } from "./imageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    taskers: taskReducer,
    eventProduct: eventReducer,
    categories: weddingcategoryReducer,
    stores: storeReducer,
    ui: uiReducer,
    sidebar: sidebarReducer,
    reviews: reviewsReducer,
    offerings: offeringsReducer,
    images: imagesReducer,
    rentHireProduct: rentHireReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AuthState = {
  user: {
    username: string;
  } | null;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
