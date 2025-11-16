import style from "./ShowProductDocument.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
interface ProductDetail {
  product_id: string;
  product_name:  string;
  specification: string;
  create_date: string;
  manufactor:string;
  brand:string;
  size:string;
  color:string;
  product_type1:string;
  product_type2:string;
  product_type3:string;
  product_type4:string;
  recommended_price:number;
  purchase_price:number;
  last_cost:number;
  average_cost:number;
  remark: string;
}
interface ShowProductDocumentProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: ProductDetail;
  type: boolean;
}
const formattedDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
}

const ShowProductDocument=({ onClose,onSuccess, detail,type }: ShowProductDocumentProps)=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<ProductDetail>(detail);
  const title=detail.product_name;
  const handleChange = (key: keyof ProductDetail, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const getProductFormat = (type: 'manufactor' | 'brand' | 'size' | 'color' | 'type', id: string) => {
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
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/product/update', {...formData});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('更新成功');
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>{title}</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品編號</div>
              <input type="text" className={style.input} value={formData.product_id} readOnly tabIndex={-1} />
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={style.input} value={formData.specification} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔時間</div>
              <input type="text" className={style.input} value={formattedDate(formData.create_date)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.product_name} onChange={(e) => handleChange("product_name", e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>廠商</div>
                <input
                list="manufactors"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.manufactor}
                onChange={(e)=>handleChange('manufactor',e.target.value)}
                maxLength={5}
                />
                <datalist id="manufactors">
                  {productInfoRelation.manufactorList.map((item) => (
                    <option key={item.manufactor_id} value={item.manufactor_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('manufactor',formData.manufactor)}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>品牌</div>
                <input
                list="brands"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.brand}
                onChange={(e)=>handleChange('brand',e.target.value)}
                maxLength={5}
                />
                <datalist id="brands">
                  {productInfoRelation.brandList.map((item) => (
                    <option key={item.brand_id} value={item.brand_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('brand',formData.brand)}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>尺碼</div>
                <input
                list="sizes"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.size}
                onChange={(e)=>handleChange('size',e.target.value)}
                maxLength={5}
                />
                <datalist id="sizes">
                  {productInfoRelation.sizeList.map((item) => (
                    <option key={item.size_id} value={item.size_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('size',formData.size)}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>顏色</div>
                <input
                list="colors"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.color}
                onChange={(e)=>handleChange('color',e.target.value)}
                maxLength={5}
                />
                <datalist id="colors">
                  {productInfoRelation.colorList.map((item) => (
                    <option key={item.color_id} value={item.color_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('color',formData.color)}></input>
          </div>
          <div className={style.typeContainer}>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input
                list="types1"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type1}
                onChange={(e)=>handleChange('product_type1',e.target.value)}
                maxLength={5}
                />
                <datalist id="types1">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',formData.product_type1)}></input>
            </div>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input
                list="types2"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type2}
                onChange={(e)=>handleChange('product_type2',e.target.value)}
                maxLength={5}
                />
                <datalist id="types2">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',formData.product_type2)}></input>
            </div>
          </div>
          <div className={style.typeContainer}>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input
                list="types3"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type3}
                onChange={(e)=>handleChange('product_type3',e.target.value)}
                maxLength={5}
                />
                <datalist id="types3">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',formData.product_type3)}></input>
            </div>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input
                list="types4"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type4}
                onChange={(e)=>handleChange('product_type4',e.target.value)}
                maxLength={5}
                />
                <datalist id="types4">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',formData.product_type4)}></input>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進價</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={isEditing ? formData.purchase_price: "$ "+formData.purchase_price} onChange={(e)=>handleChange('purchase_price',e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建議售價</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={isEditing ? formData.recommended_price: "$ "+formData.recommended_price} onChange={(e)=>handleChange('recommended_price',e.target.value)}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>最新進價</div>
              <input type="text" className={style.input} value={"$ "+formData.last_cost||''} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>平均進價</div>
              <input type="text" className={style.input} value={"$ "+formData.average_cost||''} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={formData.remark} onChange={(e) => handleChange("remark", e.target.value)} className={classNames(style.textarea,isEditing && style.edit)} maxLength={100}></textarea>
            </div>
          </div>
          {!isEditing && <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
            <div className={style.button} onClick={() => setIsEditing(true)}>編輯</div>
          </div>}
          {isEditing && <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>setIsEditing(false)}>取消</div>
            <div className={style.button} onClick={() => handleSave()}>完成</div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default ShowProductDocument;
