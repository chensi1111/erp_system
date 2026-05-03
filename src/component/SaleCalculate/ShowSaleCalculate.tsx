import style from "./ShowSaleCalculate.module.css";
import classNames from "classnames";
import { Dayjs } from "dayjs";
import Pagination from '@mui/material/Pagination';
import { useState,useEffect } from "react";
import axios, { type ApiError } from '../../api/axios'
import {toast} from 'react-toastify'
// utils
import { formattedTime,formattedDate } from "../../utils/formattedTime";
import { SaleTypeMap } from "../../utils/map";
interface Info {
  manufactor:string,
  manufactor_name:string,
  order_quantity:number,
  order_amount:number,
  sale_quantity:number,
  sale_amount:number
}
interface Detail {
  order_no:string,
  type:number,
  amount:number,
  paid_date:string,
  paid_at:string,
  total_quantity:number,
  product_id:string,
  specification:string
}
interface ShowSaleCalculateProps {
  onClose: () => void;
  manufactorInfo:Info;
  selectedDate:Dayjs
}

const ShowSaleCalculate=({ onClose,manufactorInfo,selectedDate }: ShowSaleCalculateProps)=> {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detail, setDetail] = useState<Detail[]>([])
  const getDetail = async () =>{
    try {
      const res = await axios.post('/api/report/sale_detail',{manufactor:manufactorInfo.manufactor,page,pageSize:10,selectedDate:selectedDate.format("YYYY-MM")});
      setDetail(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  useEffect(()=>{
    getDetail()
  },[page]) // eslint-disable-line react-hooks/exhaustive-deps
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
              <input type="text" className={style.input} value={manufactorInfo.sale_quantity} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總銷貨額</div>
              <input type="text" className={style.input} value={"$ "+manufactorInfo.sale_amount} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總訂貨量</div>
              <input type="text" className={style.input} value={manufactorInfo.order_quantity} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總訂貨額</div>
              <input type="text" className={style.input} value={"$ "+manufactorInfo.order_amount} readOnly tabIndex={-1}/>
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
                 <th>單號</th>
                 <th>商品型號</th>
                 <th>商品規格</th>
                 <th>建檔時間</th>
                 <th>類型</th>
                 <th>日期</th>
                 <th>數量</th>
                 <th>金額</th>
                </tr>
              </thead>
              <tbody className={style.tbody}>
                {detail.map((m) => (
                 <tr key={`${m.order_no} ${m.type}`}>
                   <td>{m.order_no}</td>
                   <td>{m.product_id}</td>
                   <td>{m.specification}</td>
                   <td>{formattedTime(m.paid_at)}</td>
                   <td className={classNames(style.type,(m.type===1 || m.type===4) && style.return,(m.type===2 || m.type===3) && style.order)}>{SaleTypeMap[m.type]}</td>
                   <td>{formattedDate(m.paid_date)}</td>
                   <td>{m.total_quantity}</td>
                    <td>$ {m.amount}</td>
                 </tr>
                ))}
                {detail.length===0 && <tr>
                 <td colSpan={8} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
                </tr>}
             </tbody>
            </table>
          </div>
          {detail.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
          <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowSaleCalculate;
