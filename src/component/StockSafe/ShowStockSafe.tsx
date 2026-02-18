import style from "./ShowStockSafe.module.css";
import classNames from "classnames";
import { useState } from "react";
// utils
import { formattedTime } from "../../utils/formattedTime";
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
interface ShowStockSafeProps {
  onClose: () => void;
  detail: StockDetail;
}
const checkStockSafe = (quantity:string,safe:string) =>{
  if(!safe) return true
  return Number(quantity) >= Number(safe)
}

const ShowStockSafe=({ onClose, detail }: ShowStockSafeProps)=> {
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
              <input type="text" className={style.input} value={formattedTime(formData.last_in_date)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>最後出貨</div>
              <input type="text" className={style.input} value={formattedTime(formData.last_out_date)} readOnly tabIndex={-1}/>
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
                            className={classNames(style.input,!checkStockSafe(item.available_quantity,item.safe_stock) && style.safeStock)}
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
                    <div className={style.inputTitle}>安全庫存</div>
                        <input
                            type="text"
                            className={classNames(style.input)}
                            value={item.safe_stock}
                            onChange={(e) => handleSafeStockChange(item.size, e.target.value)}
                            readOnly tabIndex={-1}
                        />
                    </div>
                </div>
            ))}
            </div>
          
          <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowStockSafe;
