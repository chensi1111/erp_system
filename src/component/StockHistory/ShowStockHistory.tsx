import style from "./ShowStockHistory.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
interface Quantities {
    size:string,
    available_quantity:string,
    safe_stock:string,
    quantity:string
} 
interface StockDetail {
  product_id: string;
  specification: string;
  product_name:string;
  change_type:string,
  change_number:string,
  total_quantity:number,
  price:number,
  prepaid_price:number,
  remaining_price:number,
  create_date:string,
  quantities:Quantities[];
}
interface ShowStockHistoryProps {
  onClose: () => void;
  detail: StockDetail;
}
const formattedDate = (dateString: string) => {
   if (!dateString){
      return ''
   }
  return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
}
  
const ShowStockHistory=({ onClose, detail }: ShowStockHistoryProps)=> {
  const title=detail.change_number;
  const formattedAllQuantity = (type:string,value:number|string) => {
    if(!Number(value)||type==='訂貨'|| type ==='訂貨取消'){
      return ''
    }
    if(type==='銷貨'|| type ==='進貨取消' || type==='收貨'){
      return `- ${value}`
    }else {
      return `+ ${value}`
    }
  }
  const formattedAvailableQuantity = (type:string,value:number|string) => {
    if(!Number(value) || type==='收貨'){
      return ''
    }
    if(type==='訂貨'||type==='銷貨'||type==='進貨取消'){
      return `- ${value}`
    }else if(type==='訂貨取消'||type==='銷貨取消'||type==='進貨'){
      return `+ ${value}`
    }
  }
  const formattedRemainingQuantity = (type:string,value:number|string) => {
    if(!Number(value)|| (type!=='訂貨' && type!=='訂貨取消' && type!=='收貨' && type!=='收貨取消')){
      return ''
    }
    if(type==='訂貨'||type==='收貨取消'){
      return `+ ${value}`
    }else {
      return `- ${value}`
    }
  }

  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>{title}</div>
        <div className={style.allInputs}>
           <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>庫存單號</div>
              <input type="text" className={style.input} value={detail.change_number} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建立時間</div>
              <input type="text" className={style.input} value={formattedDate(detail.create_date)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品編號</div>
              <input type="text" className={style.input} value={detail.product_id} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={style.input} value={detail.specification} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={style.input} value={detail.product_name} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>變更類型</div>
              <input type="text" className={style.input} value={detail.change_type} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>變更總量</div>
              <input type="text" className={style.input} value={formattedAllQuantity(detail.change_type,detail.total_quantity)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>單價</div>
              <input type="text" className={style.input} value={"$ "+detail.price} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總金額</div>
              <input type="text" className={style.input} value={"$ "+(detail.price*detail.total_quantity)} readOnly tabIndex={-1}/>
            </div>
          </div>
          {(detail.change_type ==='訂貨'||detail.change_type ==='訂貨取消') && <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>預付訂金</div>
              <input type="text" className={style.input} value={"$ "+detail.prepaid_price} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>剩餘金額</div>
              <input type="text" className={style.input} value={"$ "+detail.remaining_price} readOnly tabIndex={-1}/>
            </div>
          </div>}
          {( detail.change_type ==='收貨' || detail.change_type ==='收貨取消') && <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>已付訂金</div>
              <input type="text" className={style.input} value={"$ "+detail.prepaid_price} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尾款金額</div>
              <input type="text" className={style.input} value={"$ "+detail.remaining_price} readOnly tabIndex={-1}/>
            </div>
          </div>}
          <div className={style.subTitle}>變更尺寸</div>
          <div className={classNames(style.multipleInput,style.stocks)}>
            {detail.quantities.filter(item => item.size && item.size.trim() !== "").map((item) => (
                <div key={item.size} className={style.inputContainerGroup}>
                <div className={style.inputTitle}>{item.size}</div>
                <div className={style.inputContainer}>
                    <div className={style.inputTitle}>可售</div>
                        <input
                            type="text"
                            className={style.input}
                            value={formattedAvailableQuantity(detail.change_type,item.available_quantity||item.quantity)}
                            readOnly
                            tabIndex={-1}
                        />
                    </div>
                     <div className={style.inputContainer}>
                    <div className={style.inputTitle}>預留</div>
                        <input
                            type="text"
                            className={style.input}
                            value={formattedRemainingQuantity(detail.change_type,item.quantity)}
                            readOnly
                            tabIndex={-1}
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

export default ShowStockHistory;
