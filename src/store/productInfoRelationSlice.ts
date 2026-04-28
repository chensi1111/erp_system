import { createSlice} from "@reduxjs/toolkit";
export interface Manufactor {
  manufactor_id: string;
  manufactor_name: string;
}

export interface Brand {
  brand_id: string;
  brand_name: string;
}

export interface Size {
  size_id: string;
  size_name: string;
}

export interface Color {
  color_id: string;
  color_name: string;
}

export interface Type {
  type_id: string;
  type_name: string;
}

export interface ProductInfoRelationState {
  manufactorList: Manufactor[];
  brandList: Brand[];
  sizeList: Size[];
  colorList: Color[];
  typeList: Type[];
}

const initialState: ProductInfoRelationState = {
  manufactorList: [],
  brandList: [],
  sizeList: [],
  colorList: [],
  typeList: [],
};

const productInfoRelationSlice = createSlice({
  name: "productInfoRelation",
  initialState,
  reducers: {
    getProductInfoRelation(state,action) {
      const { manufactorList, brandList, sizeList, colorList, typeList } = action.payload;
      state.manufactorList = manufactorList;
      state.brandList = brandList;
      state.sizeList = sizeList;
      state.colorList = colorList;
      state.typeList = typeList;
    },
  },
});

export const { getProductInfoRelation} = productInfoRelationSlice.actions;
export default productInfoRelationSlice.reducer;
