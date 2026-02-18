import style from "./ShowStockHistory.module.css";
import classNames from "classnames";
// utils
import { formattedTime } from "../../utils/formattedTime";
import { HistoryTypeMap } from "../../utils/map";
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
  change_type:number,
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

const ShowStockHistory=({ onClose, detail }: ShowStockHistoryProps)=> {
  const title=detail.change_number;
  const InventoryChangeRules = {
  all: {
    0: -1, 3: -1, 6: -1, 11: -1, 12: -1,
    1: +1, 2: +1, 7: +1, 10: +1, 13: +1,
    4: 0, 5: 0, 8: 0, 9: 0,
  },
  available: {
    0: -1, 3: -1, 4: -1, 9: -1, 11: -1, 12: -1,
    1: +1, 2: +1, 5: +1, 8: +1, 10: +1, 13: +1,
    6: 0, 7: 0, 
  },
  reserved: {
    4: +1, 7: +1, 9: +1,
    5: -1, 6: -1, 8: -1,
    // 其他都是 0
  },
  } as const
  const formatChange = (
    ruleMap: Record<number, number>,
    type: number,
    value: number | string
  ) => {
    const num = Number(value);
    if (!num) return '';

    const sign = ruleMap[type] ?? 0;
    if (sign === 0) return '';

    return `${sign === 1 ? '+' : '-'} ${value}`;
  };
  const formattedAllQuantity = (type: number, value: number | string) =>
    formatChange(InventoryChangeRules.all, type, value);

  const formattedAvailableQuantity = (type: number, value: number | string) =>
    formatChange(InventoryChangeRules.available, type, value);

  const formattedRemainingQuantity = (type: number, value: number | string) =>
    formatChange(InventoryChangeRules.reserved, type, value);

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
              <input type="text" className={style.input} value={formattedTime(detail.create_date)} readOnly tabIndex={-1}/>
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
              <input type="text" className={style.input} value={HistoryTypeMap[detail.change_type]} readOnly tabIndex={-1}/>
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
          {(detail.change_type ===4||detail.change_type ===5) && <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>預付訂金</div>
              <input type="text" className={style.input} value={"$ "+detail.prepaid_price} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>剩餘金額</div>
              <input type="text" className={style.input} value={"$ "+detail.remaining_price} readOnly tabIndex={-1}/>
            </div>
          </div>}
          {( detail.change_type ===6 || detail.change_type ===7) && <div className={style.multipleInput}>
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
