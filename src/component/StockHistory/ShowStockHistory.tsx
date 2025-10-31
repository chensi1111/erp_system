import style from "./ShowStockHistory.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
interface Quantities {
    size:string,
    quantity:string,
    safe_stock:string
} 
interface StockDetail {
  product_id: string;
  specification: string;
  product_name:string;
  change_type:string,
  change_number:string,
  total_quantity:number,
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
  const formattedQuantity = (type:string,value:number|string) => {
    if(Number(value)==0){
      return ''
    }
    if(type==='銷貨'){
      return `- ${value}`
    }else {
      return `+ ${value}`
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
              <input type="text" className={style.input} value={formattedQuantity(detail.change_type,detail.total_quantity)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.subTitle}>變更尺寸</div>
          <div className={classNames(style.multipleInput,style.stocks)}>
            {detail.quantities.filter(item => item.size && item.size.trim() !== "").map((item) => (
                <div key={item.size} className={style.inputContainerGroup}>
                <div className={style.inputContainer}>
                    <div className={style.inputTitle}>{item.size}</div>
                        <input
                            type="text"
                            className={style.input}
                            value={formattedQuantity(detail.change_type,item.quantity)}
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
