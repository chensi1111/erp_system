import style from "./ShowManufactorRestockTable.module.css";
import classNames from "classnames";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { formattedDate,formattedTime } from "../../utils/formattedTime";
import { getProductFormat } from "../../utils/productInfoMap";
import { RestockTypeMap } from "../../utils/map";
const ShowManufactorRestockTable=({onClose,detail}: {onClose: () => void,detail:any})=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const restock = detail.restock
  const items =detail.items
  const formattedQuantity = (quantities: any[]) => {
  return (
    <div className={style.sizeBadges}>
      {quantities
        .filter(q => Number(q.all_quantity) > 0)
        .map((q, idx) => (
          <span key={idx} className={style.badge}>
            {q.size} : {q.all_quantity}
          </span>
        ))
      }
    </div>
  );
};
const getTotalQuantity = () => {
  return items.reduce((sum:any, item:any) => sum + Number(item.total_quantity), 0);
};
const getTotalPrice = () => {
  return items.reduce((sum:any, item:any) => {
    return sum + Number(item.total_quantity) * Number(item.price);
  }, 0);
};
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>{`${restock.type===0 ? '進貨單': '退貨單'} ${restock.restock_id}`}</div>
        <div className={style.allInputs}>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易方式</div>
              <input type="text" className={classNames(style.input,style.disable)} value={RestockTypeMap[restock.transaction]} tabIndex={-1} readOnly/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進貨日期</div>
              <input type="text" className={classNames(style.input,style.disable)} value={formattedDate(restock.date)} tabIndex={-1} readOnly/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔時間</div>
              <input type="text" className={classNames(style.input,style.disable)} value={formattedTime(restock.create_date)} tabIndex={-1} readOnly/>
            </div>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>廠商</div>
                <input className={classNames(style.input,style.disable)} value={restock.manufactor} tabIndex={-1} readOnly/>
              <input type="text" disabled className={style.selectName} value={getProductFormat('manufactor',restock.manufactor,productInfoRelation)} tabIndex={-1} readOnly></input>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={restock.remark} className={classNames(style.textarea,style.disable)} tabIndex={-1} readOnly></textarea>
            </div>
          </div>
        </div>
          <div className={style.topContainer}>
            <div className={style.infos}>
              <div className={style.info}>總數量 : <span>{getTotalQuantity()}</span></div>
              <div className={style.info}>總金額 : <span>$ {getTotalPrice()}</span></div>
            </div>
          </div>
          <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>商品型號</th>
              <th>商品規格</th>
              <th>數量</th>
              <th>單價</th>
              <th>總價</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m:any,index:any) => (
              <tr key={index}>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.total_quantity}<br/>{formattedQuantity(m.quantities)}</td>
                <td>$ {m.price}</td>
                <td>$ {Number(m.price)*Number(m.total_quantity)}</td>
              </tr>
            ))}
            {items.length===0 && <tr>
              <td colSpan={5} style={{textAlign:'center',padding:'20px 0'}}>資料為空</td>
            </tr>}
          </tbody>
        </table>
      </div>
        
        <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
        </div>
      </div>
    </div>
  );
}

export default ShowManufactorRestockTable;
