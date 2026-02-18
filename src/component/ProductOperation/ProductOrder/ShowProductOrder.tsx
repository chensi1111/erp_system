import style from "./ShowProductOrder.module.css";
import classNames from "classnames";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import axios from "../../../api/axios"
import { toast } from "react-toastify";
// utils
import { formattedDate,formattedTime } from "../../../utils/formattedTime";
import { getProductFormat } from "../../../utils/productInfoMap";
import { SaleTypeMap,PayTypeMap,TransactionTypeMap } from "../../../utils/map";
interface OrderDetail {
  order_no:string,
  create_date:string,
  product_id:string,
  specification:string,
  product_name:string,
  manufactor:string,
  brand:string,
  size:string,
  color:string,
  size_list:string,
  quantities:[{
    size:string,
    quantity:string
  }],
  price:number,
  prepaid_price:number,
  remaining_price:number,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  remark: string,
  date:string,
  transaction:number,
  pay:number,
  type:number,
  amount:number,
  paid_at:string,
  total_quantity:number
}
interface ShowProductOrderProps {
  onClose: () => void;
  detail: OrderDetail;
  onSuccess: () => void;
}

const getPrepaidPrice = (detail:OrderDetail) =>{
  if(detail.type===2||detail.type===4){
    return detail.amount;
  }else{
    return (Number(detail.price)*detail.total_quantity) - Number(detail.amount);
  }
}
const getRemainingPrice = (detail:OrderDetail) =>{
  if(detail.type===3){
    return detail.amount;
  }else{
    return (Number(detail.price)*detail.total_quantity) - Number(detail.amount);
  }
}
const ShowProductOrder=({ onClose,onSuccess, detail }: ShowProductOrderProps)=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const title=detail.order_no;
  const list =detail.size_list.split(',').slice(0, 10)
  const totalQuantity = detail.quantities.reduce((sum, item) => {
    const qty = parseInt(item.quantity);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);
  const dateLabelMap: Record<number, string> = {
  2: "訂貨日期",
  3: "取貨日期",
  4: "退訂日期",
};
  const prepaidLabelMap: Record<number, string> = {
  2: "預付訂金",
  3: "已付訂金",
  4: "已付訂金",
};

  const handleComplete = async() =>{
    try {
      const response = await axios.post('/api/sale/order_complete', {order_no:detail.order_no});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('取貨成功');
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  const handleDelete = async() =>{
    try {
      const response = await axios.post('/api/sale/delete_order', {order_no:detail.order_no,type:4});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('退訂成功');
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
              <div className={style.inputTitle}>訂貨單號</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.order_no}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易途徑</div>
                <input type="text" className={style.input} readOnly tabIndex={-1} value={TransactionTypeMap[detail.transaction]}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>付款方式</div>
                <input type="text" className={style.input} readOnly tabIndex={-1} value={PayTypeMap[detail.pay]}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易狀態</div>
               <input type="text" className={style.input} readOnly tabIndex={-1} value={SaleTypeMap[detail.type]}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔時間</div>
               <input type="text" className={style.input} readOnly tabIndex={-1} value={formattedTime(detail.create_date)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>{dateLabelMap[detail.type]}</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={formattedDate(detail.paid_at)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品型號</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.product_id}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.specification}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.product_name}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商</div>
              <input type="text" value={getProductFormat('manufactor',detail.manufactor,productInfoRelation)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" value={getProductFormat('brand',detail.brand,productInfoRelation)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" value={getProductFormat('size',detail.size,productInfoRelation)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" value={getProductFormat('color',detail.color,productInfoRelation)} className={style.input} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" value={getProductFormat('type',detail.product_type1,productInfoRelation)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" value={getProductFormat('type',detail.product_type2,productInfoRelation)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" value={getProductFormat('type',detail.product_type3,productInfoRelation)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" value={getProductFormat('type',detail.product_type4,productInfoRelation)||''} className={style.input} readOnly tabIndex={-1}/>
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
                          className={classNames(style.input)} 
                          value={detail.quantities[index].quantity}
                          readOnly tabIndex={-1}
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
              <div className={style.inputTitle}>售價</div>
              <input type="text" className={classNames(style.input)} value={"$ "+detail.price} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總計</div>
              <input type="text" className={style.input} value={"$ "+Number(detail.price)*totalQuantity} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>{prepaidLabelMap[detail.type]}</div>
              <input type="text" className={style.input} value={"$ "+getPrepaidPrice(detail)} readOnly tabIndex={-1}/>
            </div>
            {detail.type!==4 && <div className={style.inputContainer}>
              <div className={style.inputTitle}>{detail.type ===2 ? '剩餘尾款' : '結清尾款'}</div>
              <input type="text" className={style.input} value={"$ "+getRemainingPrice(detail)} readOnly tabIndex={-1}/>
            </div>}
            {detail.type===4 && <div className={style.inputContainer}>
              <div className={style.inputTitle}>歸還訂金</div>
              <input type="text" className={style.input} value={"$ "+getPrepaidPrice(detail)} readOnly tabIndex={-1}/>
            </div>}
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={detail.remark} className={classNames(style.textarea)} maxLength={100} readOnly tabIndex={-1}></textarea>
            </div>
          </div>
          <div className={style.buttons}>
            {detail.type ===2 && <div className={classNames(style.button)} onClick={()=>handleComplete()}>取貨</div>}
            {detail.type ===2 && <div className={classNames(style.button,style.cancel)} onClick={()=>handleDelete()}>退訂</div>}
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProductOrder;
