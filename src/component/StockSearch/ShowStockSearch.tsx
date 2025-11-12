import style from "./ShowStockSearch.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
interface Stock_qty {
    size:string,
    all_quantity:string,
    available_quantity:string,
    reserved_quantity:string,
    safe_stock:string
} 
interface StockDetail {
  product_id: string;
  product_name:  string;
  specification: string;
  stock_qty:Stock_qty[];
  last_in_date:string;
  last_out_date:string;
}
interface ShowStockSearchProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: StockDetail;
  type: boolean;
}
const formattedDate = (dateString: string) => {
   if (!dateString){
      return ''
   }
  return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
}

const ShowStockSearch=({ onClose,onSuccess, detail,type }: ShowStockSearchProps)=> {
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<StockDetail>(detail);
  const title=detail.product_name;
  const handleSafeStockChange = (size: string, value: string) => {
     setFormData((prev) => {
     const updatedStock = prev.stock_qty.map((item) =>
        item.size === size ? { ...item, safe_stock: value } : item
     );
        return {
       ...prev,
       stock_qty: updatedStock,
     };
    });
  };
  const handleSave = async () => {
    const data = {
        specification:formData.specification,
        stock_qty:formData.stock_qty
    }
    try {
      const response = await axios.post('/api/stock/update', {...data});
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
              <input type="text" className={style.input} value={formData.product_id} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={style.input} value={formData.specification} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>最後進貨</div>
              <input type="text" className={style.input} value={formattedDate(formData.last_in_date)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>最後出貨</div>
              <input type="text" className={style.input} value={formattedDate(formData.last_out_date)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={style.input} value={formData.product_name} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.subTitle}>尺寸庫存</div>
          <div className={classNames(style.multipleInput,style.stocks)}>
            {formData.stock_qty.filter(item => item.size && item.size.trim() !== "").map((item) => (
                <div key={item.size} className={style.inputContainerGroup}>
                <div className={style.inputTitle}>{item.size}</div>
                <div className={style.inputContainer}>
                  <div className={style.inputTitle}>總庫存</div>
                      <input
                          type="text"
                          className={style.input}
                          value={item.all_quantity}
                          readOnly
                          tabIndex={-1}
                      />
                </div>
                 <div className={style.inputContainer}>
                    <div className={style.inputTitle}>可售</div>
                        <input
                            type="text"
                            className={style.input}
                            value={item.available_quantity}
                            readOnly
                            tabIndex={-1}
                        />
                    </div>
                     <div className={style.inputContainer}>
                    <div className={style.inputTitle}>預留</div>
                        <input
                            type="text"
                            className={style.input}
                            value={item.reserved_quantity}
                            readOnly
                            tabIndex={-1}
                        />
                    </div>
                  <div className={style.inputContainer}>
                    <div className={style.inputTitle}>安全</div>
                        <input
                            type="text"
                            className={classNames(style.input,isEditing && style.edit)}
                            value={item.safe_stock}
                            onChange={(e) => handleSafeStockChange(item.size, e.target.value)}
                        />
                    </div>
                </div>
            ))}
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

export default ShowStockSearch;
