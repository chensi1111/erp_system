import style from "./ShowRestockCalculate.module.css";
import classNames from "classnames";
import  { Dayjs } from "dayjs";
import Pagination from '@mui/material/Pagination';
import { useState,useEffect } from "react";
import axios from '../../api/axios'
import {toast} from 'react-toastify'
// utils
import { formattedDate,formattedTime } from "../../utils/formattedTime";

interface Info {
  manufactor:string,
  manufactor_name:string,
  total_in_quantity:string,
  total_in_price:string,
  total_return_quantity:string,
  total_return_price:string,
}
interface Detail {
  restock_id:string,
  create_date:string,
  total_in_quantity:string,
  total_in_price:string,
  total_return_quantity:string,
  total_return_price:string,
  date:string
}
interface ShowRestockCalculateProps {
  onClose: () => void;
  manufactorInfo:Info;
  selectedDate:Dayjs
}

const ShowRestockCalculate=({ onClose,manufactorInfo,selectedDate }: ShowRestockCalculateProps)=> {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detail, setDetail] = useState<Detail[]>([])
  const getDetail = async () =>{
    try {
      const res = await axios.post('/api/report/restock_detail',{manufactor:manufactorInfo.manufactor,page,pageSize:10,selectedDate:selectedDate.format("YYYY-MM")});
      setDetail(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  useEffect(()=>{
    getDetail()
  },[page])
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
              <input type="text" className={style.input} value={manufactorInfo.total_in_quantity} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總進貨額</div>
              <input type="text" className={style.input} value={"$ "+manufactorInfo.total_in_price} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總退貨量</div>
              <input type="text" className={style.input} value={manufactorInfo.total_return_quantity} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總退貨額</div>
              <input type="text" className={style.input} value={"$ "+manufactorInfo.total_return_price} readOnly tabIndex={-1}/>
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
                 <th>建檔時間</th>
                 <th>類型</th>
                 <th>日期</th>
                 <th>數量</th>
                 <th>金額</th>
                </tr>
              </thead>
              <tbody className={style.tbody}>
                {detail.map((m) => (
                 <tr key={m.restock_id}>
                   <td>{m.restock_id}</td>
                   <td>{formattedTime(m.create_date)}</td>
                   <td className={classNames(style.type,Number(m.total_return_quantity) && style.return)}>{Number(m.total_in_quantity) ? '進貨':'退貨'}</td>
                   <td>{formattedDate(m.date)}</td>
                   <td>{Number(m.total_in_quantity) || Number(m.total_return_quantity)}</td>
                   <td>$ {Number(m.total_in_price) || Number(m.total_return_price)}</td>
                 </tr>
                ))}
                {detail.length===0 && <tr>
                 <td colSpan={6} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
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

export default ShowRestockCalculate;
