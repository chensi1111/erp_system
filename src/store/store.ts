import { configureStore } from '@reduxjs/toolkit';
import manufactorDocumentReducer from './manufactorDocumentSlice';

export const store = configureStore({
  reducer: {
    manufactorDocument: manufactorDocumentReducer,
  },
});

// 為 TypeScript 推導型別用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;