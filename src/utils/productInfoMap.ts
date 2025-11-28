
export const getProductFormat = (type: 'manufactor' | 'brand' | 'size' | 'color' | 'type', id: string,productInfoRelation:any) => {
  switch (type) {
    case 'manufactor':
      return productInfoRelation.manufactorList.find((item:any) => item.manufactor_id === id)?.manufactor_name || '';
    case 'brand':
      return productInfoRelation.brandList.find((item:any) => item.brand_id === id)?.brand_name || '';
    case 'size':
      return productInfoRelation.sizeList.find((item:any) => item.size_id === id)?.size_name || '';
    case 'color':
      return productInfoRelation.colorList.find((item:any) => item.color_id === id)?.color_name || '';
    case 'type':
      return productInfoRelation.typeList.find((item:any) => item.type_id === id)?.type_name || '';
    default:
      return '';
  }
};