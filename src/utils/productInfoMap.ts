import type { ProductInfoRelationState } from "../store/productInfoRelationSlice";

export const getProductFormat = (
  type: 'manufactor' | 'brand' | 'size' | 'color' | 'type',
  id: string,
  productInfoRelation: ProductInfoRelationState
) => {
  switch (type) {
    case 'manufactor':
      return productInfoRelation.manufactorList.find(item => item.manufactor_id === id)?.manufactor_name || '';
    case 'brand':
      return productInfoRelation.brandList.find(item => item.brand_id === id)?.brand_name || '';
    case 'size':
      return productInfoRelation.sizeList.find(item => item.size_id === id)?.size_name || '';
    case 'color':
      return productInfoRelation.colorList.find(item => item.color_id === id)?.color_name || '';
    case 'type':
      return productInfoRelation.typeList.find(item => item.type_id === id)?.type_name || '';
    default:
      return '';
  }
};
