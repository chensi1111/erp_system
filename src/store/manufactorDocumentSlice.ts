import { createSlice } from '@reduxjs/toolkit';

const manufactorDocumentSlice = createSlice({
  name: 'manufactorDocumentSlice',
  initialState: {
    open: false,
  },
  reducers: {
    openManufactorDocumentSlice: (state) => {
      state.open=true
    },
    closeManufactorDocumentSlice: (state) => {
      state.open =false;
    }
  },
});

export const { openManufactorDocumentSlice,closeManufactorDocumentSlice} = manufactorDocumentSlice.actions;
export default manufactorDocumentSlice.reducer;