import { configureStore } from '@reduxjs/toolkit';
import productInfoRelationSlice from './productInfoRelationSlice';
import safeStockSlice from './safeStcokSlice'

export const store = configureStore({
  reducer: {
    productInfoRelation: productInfoRelationSlice,
    safeStock: safeStockSlice
  },
});

// 為 TypeScript 推導型別用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;