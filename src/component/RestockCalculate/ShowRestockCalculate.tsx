import style from "./ShowRestockCalculate.module.css";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";

interface Info {
  manufactor:string,
  manufactor_name:string,
  total_quantity:string,
  total_price:string
}
interface Detail {
  restock_id:string,
  create_date:string,
  total_quantity:string,
  total_price:string,
  date:string
}
interface ShowRestockCalculateProps {
  onClose: () => void;
  detail: Detail[];
  manufactorInfo:Info;
  selectedDate:Dayjs
}

const ShowRestockCalculate=({ onClose, detail,manufactorInfo,selectedDate }: ShowRestockCalculateProps)=> {
  const formattedTime = (dateString: string) => {
    return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
  }
  const formattedDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY/MM/DD');
  }
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
              <div className={style.inputTitle}>總進貨量</div>
              <input type="text" className={style.input} value={manufactorInfo.total_quantity} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總進貨額</div>
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
                 <th>進貨單號</th>
                 <th>建檔時間</th>
                 <th>進貨日期</th>
                 <th>進貨數量</th>
                 <th>總進貨額</th>
                </tr>
              </thead>
              <tbody className={style.tbody}>
                {detail.map((m) => (
                 <tr key={m.restock_id}>
                   <td>{m.restock_id}</td>
                   <td>{formattedTime(m.create_date)}</td>
                   <td>{formattedDate(m.date)}</td>
                   <td>{m.total_quantity}</td>
                    <td>{"$ "+m.total_price}</td>
                 </tr>
                ))}
                {detail.length===0 && <tr>
                 <td colSpan={5} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
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

export default ShowRestockCalculate;
