import style from "./ShowSaleCalculate.module.css";
import classNames from "classnames";
import { Dayjs } from "dayjs";
import { formattedTime } from "../../utils/formattedTime";

interface Info {
  manufactor:string,
  manufactor_name:string,
  total_quantity:string,
  total_price:string
}
interface Detail {
  sale_id:string,
  create_date:string,
  total_quantity:string,
  total_price:string
}
interface ShowSaleCalculateProps {
  onClose: () => void;
  detail: Detail[];
  manufactorInfo:Info;
  selectedDate:Dayjs
}

const ShowSaleCalculate=({ onClose, detail,manufactorInfo,selectedDate }: ShowSaleCalculateProps)=> {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商編號</div>
              <input type="text" className={style.input} value={manufactorInfo.manufactor} readOnly tabIndex={-1} />
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商名稱</div>
              <input type="text" className={style.input} value={manufactorInfo.manufactor_name} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總銷貨量</div>
              <input type="text" className={style.input} value={manufactorInfo.total_quantity} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總銷貨額</div>
              <input type="text" className={style.input} value={"$ "+manufactorInfo.total_price} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>時間區間</div>
              <input type="text" className={style.input} value={selectedDate.format("YYYY-MM")} readOnly tabIndex={-1}/>
            </div>
          </div>
           <div className={style.tableContainer}>
            <table className={style.table}>
              <thead>
               <tr>
                 <th>銷貨單號</th>
                 <th>銷貨時間</th>
                 <th>銷貨數量</th>
                 <th>總銷貨額</th>
                </tr>
              </thead>
              <tbody className={style.tbody}>
                {detail.map((m) => (
                 <tr key={m.sale_id}>
                   <td>{m.sale_id}</td>
                   <td>{formattedTime(m.create_date)}</td>
                   <td>{m.total_quantity}</td>
                    <td>{"$ "+m.total_price}</td>
                 </tr>
                ))}
                {detail.length===0 && <tr>
                 <td colSpan={4} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
                </tr>}
             </tbody>
            </table>
          </div>
          <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowSaleCalculate;
