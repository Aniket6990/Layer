import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import extensionstore from "../store/extensionstore";

export const store = configureStore({
  reducer: {
    extension: extensionstore,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
