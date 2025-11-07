import { createSlice} from "@reduxjs/toolkit";
const initialState = {
  lowSafeStockCount:0
};

const safeStockSlice = createSlice({
  name: "safeStock",
  initialState,
  reducers: {
    getSafeStockCount(state,action) {
      if(action.payload > 99){
        state.lowSafeStockCount = 99
      }else{
        state.lowSafeStockCount = action.payload
      }
    },
  },
});

export const { getSafeStockCount} = safeStockSlice.actions;
export default safeStockSlice.reducer;
