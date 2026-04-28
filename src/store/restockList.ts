import { createSlice } from "@reduxjs/toolkit";
export interface RestockQuantity {
  size: string;
  all_quantity: string;
  available_quantity: string;
  reserved_quantity: string;
  safe_stock: string;
}
export interface RestockItem {
  product_id: string;
  specification: string;
  total_quantity:number;
  total_price:number;
  price:number;
  quantities: RestockQuantity[];
  product_name:string;
  manufactor:string;
  brand:string;
  size:string;
  color:string;
  type1:string;
  type2:string;
  type3:string;
  type4:string;
  sizeList:string;
}
interface ProductInfo {
  product_id:string
}
interface RestockState {
  list: RestockItem[];
  productList:ProductInfo[];
  currentManufactor:string;
  all_quantity:number;
  all_price:number
}
const initialState: RestockState = {
  list: [],
  productList:[],
  currentManufactor:"",
  all_quantity:0,
  all_price:0
};
function calculateTotals(state: RestockState) {
  state.all_quantity = state.list.reduce((sum, item) => sum + item.total_quantity, 0);
  state.all_price = state.list.reduce((sum, item) => sum + item.total_price, 0);
}

const restockListSlice = createSlice({
  name: "restockList",
  initialState,
  reducers: {
    addNewProduct(state, action) {
      state.list.push(action.payload)
      calculateTotals(state)
    },
    clearProducts(state) {
      state.list = []
      calculateTotals(state)
    },
    deleteProduct(state, action) {
     const index = action.payload;
     if (index >= 0 && index < state.list.length) {
       state.list.splice(index, 1);
      }
     calculateTotals(state);
    },
    getProductList(state, action) {
      state.productList = action.payload
    },
    getManufactor(state, action) {
      state.currentManufactor =action.payload
    }
  },
});

export const { addNewProduct,getProductList,getManufactor,clearProducts,deleteProduct } = restockListSlice.actions;
export default restockListSlice.reducer;
