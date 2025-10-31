import style from "./ShowProductSale.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
interface SaleDetail {
  transaction:string,
  sale_id:string,
  create_date:string,
  product_id:string,
  specification:string,
  product_name:string,
  manufactor_id:string,
  brand_id:string,
  size_id:string,
  color_id:string,
  size_list:string,
  quantities:[{
    size:string,
    quantity:string
  }],
  price:string,
  type1_id:string,
  type2_id:string,
  type3_id:string,
  type4_id:string,
  remark: string,
}
interface ShowProductSaleProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: SaleDetail;
  type: boolean;
}
const formattedDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
}


const ShowProductSale=({ onClose,onSuccess, detail,type }: ShowProductSaleProps)=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<SaleDetail>(detail);
  const title=detail.sale_id;
  const list =detail.size_list.split(',').slice(0, 10)
  const totalQuantity = formData.quantities.reduce((sum, item) => {
    const qty = parseInt(item.quantity);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);
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
  const handleChange = (key: keyof SaleDetail, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/sale/update', {
        sale_id:formData.sale_id,
        transaction:formData.transaction,
        price:formData.price,
        quantities:JSON.stringify(formData.quantities),
        remark:formData.remark
      });
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
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>銷貨單號</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={formData.sale_id}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易方式</div>
                <select className={classNames(style.select,isEditing && style.edit,!isEditing && style.hideSelect)} value={formData.transaction}  onChange={(e) => handleChange("transaction", e.target.value)}>  
                  <option value="現場">現場</option>
                  <option value="網路">網路</option>
                </select>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>銷貨時間</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={formattedDate(formData.create_date)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品型號</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={formData.product_id}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={formData.specification}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={formData.product_name}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商</div>
              <input type="text" value={getProductFormat('manufactor',formData.manufactor_id)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" value={getProductFormat('brand',formData.brand_id)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" value={getProductFormat('size',formData.size_id)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" value={getProductFormat('color',formData.color_id)} className={style.input} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" value={getProductFormat('type',formData.type1_id)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" value={getProductFormat('type',formData.type2_id)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" value={getProductFormat('type',formData.type3_id)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" value={getProductFormat('type',formData.type4_id)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼數量</div>
              <table>
                <thead>
                  <tr>
                     {Array.from({ length: 10 }).map((_, index) => (
                      <th key={index} className={classNames(!list[index] && style.hideInput)}>
                        {list[index]}
                      </th>
                    ))}
                 </tr>
                </thead>
                <tbody>
                  <tr>
                     {Array.from({ length: 10 }).map((_, index) => (
                      <td key={index} className={classNames(!list[index] && style.hideInput)}>
                        <input type="text"
                          className={classNames(style.input,isEditing && style.edit)} 
                          value={formData.quantities[index].quantity}
                          onChange={(e) => {
                            const newQuantities = [...formData.quantities];
                            newQuantities[index].quantity = e.target.value;
                            handleChange("quantities", newQuantities)
                          }}
                          maxLength={3}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進價</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.price} onChange={(e) => handleChange("price", e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總計</div>
              <input type="text" className={style.input} value={Number(formData.price)*totalQuantity} readOnly tabIndex={-1}/>
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

export default ShowProductSale;
