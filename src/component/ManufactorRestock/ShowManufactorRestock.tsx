import style from "./ShowManufactorRestock.module.css";
import classNames from "classnames";
import type { RestockQuantity } from "../../store/restockList";
interface RestockDetail {
  product_id: string;
  specification: string;
  total_quantity:number;
  total_price:number;
  price:number;
  quantities: RestockQuantity[];
  product_name:string;
  manufactor:string;
  brand:string;
  size:string;
  color:string;
  type1:string;
  type2:string;
  type3:string;
  type4:string;
  sizeList:string
}
interface ShowManufactorRestockProps {
  onClose: () => void;
  detail: RestockDetail;
}

const ShowManufactorRestock=({ onClose, detail }: ShowManufactorRestockProps)=> {
  const list =detail.sizeList.split(',').slice(0, 10)

  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.allInputs}>
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
              <input type="text" value={detail.manufactor} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" value={detail.brand} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" value={detail.size} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" value={detail.color} className={style.input} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" value={detail.type1} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" value={detail.type2} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" value={detail.type3} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" value={detail.type4} className={style.input} readOnly tabIndex={-1}/>
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
                          value={detail.quantities[index].available_quantity}
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
              <div className={style.inputTitle}>價格</div>
              <input type="text" className={classNames(style.input)} value={"$ "+detail.price} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總計</div>
              <input type="text" className={style.input} value={"$ "+detail.total_price} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowManufactorRestock;
